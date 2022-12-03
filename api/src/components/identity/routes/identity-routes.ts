import express, { RequestHandler, Router } from 'express';
import { OAuth2 } from 'oauth';
import passport from 'passport';
import * as github from 'passport-github2';
import * as google from 'passport-google-oauth20';
import OAuth2Strategy, * as oauth2 from 'passport-oauth2';
import Container from 'typedi';
import { IdentityConfigOptions } from "../config/IdentityConfigOptions";
import { ServerConfigOptions } from "../../../lib/core/config/ServerConfigOptions";
import Logger from "../../../lib/core/logger/Logger";
import { IdpConnect } from '../entities/identity/IdpConnect';
import { AuthorizationServer } from '../lib/oauth2';
import { handleExpressResponse } from '../lib/oauth2/adapters/express';
import { SecurityService } from '../services/identity/SecurityService';
import { UserService } from '../services/identity/UserService';

const logger = Logger(module)





function W3lOAuthStrategy(
    options: {
        clientID?: string
        clientSecret?: string
        authorizationURL?: string
        tokenURL?: string
        callbackURL?: string
        profileUrl?: string
    },
    provider: string
): OAuth2Strategy {

    const identityConfig: IdentityConfigOptions = Container.get('IdentityConfigOptions');
    const serverConfig: ServerConfigOptions = Container.get('ServerConfigOptions');

    const clientId = options.clientID || identityConfig.federated[provider].client_id as string;
    const secret = options.clientSecret || identityConfig.federated[provider].client_secret;
    const userProfileURL = options.profileUrl
        || identityConfig.federated[provider].profile_url
        || serverConfig.host + '/oauth2/userinfo';
    const authorizationURL = options.authorizationURL
        || identityConfig.federated[provider].authorize_url
        || serverConfig.host + '/oauth2/authorize';
    const tokenURL = options.tokenURL
        || identityConfig.federated[provider].token_url
        || serverConfig.host + '/oauth2/token';
    const callbackURL = options.callbackURL
        || identityConfig.federated[provider].callback_url
        || serverConfig.host + `/login/${provider}/cb`;


    const doIdpConnect = idpConnectCallback(provider)
    return new oauth2.Strategy({
        authorizationURL: authorizationURL,
        tokenURL: tokenURL,
        clientID: clientId,
        clientSecret: secret,
        callbackURL: callbackURL
    }, (accessToken: string,
        refreshToken: string,
        profile: passport.Profile,
        done: oauth2.VerifyCallback) => {
        /**
         * call fetchToken from w3l server.
         */
        const oauth2 = new OAuth2(clientId, secret, '', authorizationURL, tokenURL, {
            'Authorization': `Bearer ${accessToken}`
        });
        oauth2.get(userProfileURL, accessToken, function (err, body, response) {
            var json;

            logger.debug("do the actual user profile fetch");
            if (err) {
                logger.error("error fetching profile:", err)
                if (err.data) {
                    try {
                        json = JSON.parse(err.data);
                    } catch (_) { }
                }
                done(new Error("error from server:"), {});
                return
            }

            try {
                json = JSON.parse(body as string);
            } catch (ex) {
                logger.error(new Error('Failed to parse user profile'));
                //done(new Error("error from server:"), {});
            }
            logger.debug("response from server:", json);
            profile.id = json.id;
            profile.provider = 'w3l';
            (profile as any)._raw = body as string;
            (profile as any)._json = json;

            doIdpConnect(accessToken, refreshToken, profile, done);
        })
    })
}

const idpConnectCallback = (provider: string) => {
    return async (
        accessToken: string,
        refreshToken: string,
        profile: passport.Profile,
        done: oauth2.VerifyCallback
    ) => {
        logger.debug(`passport ${provider} verify: `, { accessToken, refreshToken, profile });

        const userService = Container.get(UserService);

        let idpConnect = await IdpConnect.findOne({
            where: {
                provider: provider,
                providerId: profile.id
            }
        });
        if (idpConnect) {
            // found the user
            logger.debug(`passport ${provider} user found: `, profile.id)
            done(null, {
                profile: profile,
                userId: idpConnect.userId,
                provider: provider
            });
            return;
        }

        try {
            idpConnect = await userService.IdpConnect(provider, profile)
            if (idpConnect) {
                return done(null, {
                    profile: profile,
                    userId: idpConnect.userId,
                    provider: provider
                });
            } else {
                return done(new Error("unable to create idpConnect"), {});
            }

        } catch (err) {
            done(err as Error, profile);
        }
    }
}

const idpCallbackHandler = (provider: string): RequestHandler => {
    return async (req, resp) => {
        const passportHandler = passport.authenticate(provider, { session: false }, async (err, user) => {
            if (!err) {
                const securityService = Container.get(SecurityService);
                const authorizationServer = Container.get(AuthorizationServer);

                const oauthRequest = req.session.oauth2?.request
                if (oauthRequest) {
                    const redirectUri = req.session.auth?.cb_uri
                    logger.debug("it was an origianl oauth request:", oauthRequest);
                    /**
                     * original login request originated as oauth2
                     */
                    oauthRequest.user = { id: user.userId };
                    oauthRequest.isAuthorizationApproved = true;
                    //oauthRequest.redirectUri = redirectUri ? redirectUri : __SERVER_CONFIG__.appHost + '/accounting/dashboard';

                    securityService.createUserSession(req, resp, { id: user.userId, ...user });
                    const oauthResponse = await authorizationServer.completeAuthorizationRequest(oauthRequest);
                    /**
                     * clear the original oauth2 session context
                     */
                    req.session.oauth2 = undefined;
                    return handleExpressResponse(resp, oauthResponse)
                } else {
                    const redirectUri = req.session.auth?.cb_uri

                    /**
                     * user is loggedin, lets create a session
                     */
                    securityService.createUserSession(req, resp, { id: user.userId, ...user });
                    logger.debug("callback: login user:", user.userId);
                    logger.debug("callback: redirecting to ", redirectUri);
                    /**
                     * clear initial auth request
                     */
                    req.session.auth = undefined;
                    resp.redirect(redirectUri);
                }
                return;
            } else {
                const redirectUri = req.session.auth?.err_cb_uri
                logger.debug("callback: its an error:", err);
                logger.debug("callback: redirecting to ", redirectUri);
                /**
                 * clear initial auth request
                 */
                req.session.auth = undefined;
                resp.redirect(redirectUri);
                return;

            }
        });
        passportHandler(req, resp);
    }
}
const idpLoginHandler = (provider: string, scopes: string[]): RequestHandler => {
    return async (req, resp) => {
        const oauthRequest = req.session.oauth2?.request
        if (!oauthRequest) {
            const callbackURI = req.query.cb_uri
            const errorCallbackURI = req.query.err_cb_uri
            if (!callbackURI) {
                resp.status(400).json({ error: { message: 'missing query param "cb" i.e redirect url' } });
                return
            }
            req.session.auth = {
                cb_uri: callbackURI,
                err_cb_uri: errorCallbackURI ? errorCallbackURI : callbackURI
            }
        }

        passport.authenticate(provider, { session: false, scope: scopes })(req, resp);
    }
}

export const initRoutes = (): Router => {
    const identityConfig: IdentityConfigOptions = Container.get('IdentityConfigOptions');
    const serverConfig: ServerConfigOptions = Container.get('ServerConfigOptions');

    const router = express.Router();
    for (const providerName in identityConfig.federated) {
        const providerConfig = identityConfig.federated[providerName];
        if (providerConfig.type === 'google') {
            passport.use(providerName,
                new google.Strategy({
                    clientID: identityConfig.federated[providerName].client_id,
                    clientSecret: identityConfig.federated[providerName].client_secret,
                    callbackURL: serverConfig.host + `/login/${providerName}/cb`,
                    state: true
                }, idpConnectCallback(providerName))
            );
        } else if (providerConfig.type === 'github') {
            passport.use(providerName,
                new github.Strategy({
                    clientID: identityConfig.federated[providerName].client_id,
                    clientSecret: identityConfig.federated[providerName].client_secret,
                    callbackURL: serverConfig.host + `/login/${providerName}/cb`
                }, idpConnectCallback(providerName))
            );
        } else if (providerConfig.type === 'w3l') {
            passport.use(providerName, W3lOAuthStrategy({
                clientID: identityConfig.federated[providerName].client_id,
                clientSecret: identityConfig.federated[providerName].client_secret,
                callbackURL: serverConfig.host + `/login/${providerName}/cb`
            }, providerName));
        }

        router.get(`/login/federated/${providerName}`, idpLoginHandler(providerName, providerConfig.scopes));
        router.get(`/login/${providerName}/cb`, idpCallbackHandler(providerName));
    }
    return router;
}



//module.exports = initRoutes
