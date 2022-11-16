import express, { RequestHandler } from 'express';
import { OAuth2 } from 'oauth';
import passport from 'passport';
import * as github from 'passport-github2';
import * as google from 'passport-google-oauth20';
import OAuth2Strategy, * as oauth2 from 'passport-oauth2';
import { handleExpressResponse } from '../../oauth2/adapters/express';
import Container from 'typedi';
import { __SERVER_CONFIG__ } from '../../app/app-constants';
import { IdpConnect } from '../../entities/identity/IdpConnect';
import { AuthorizationServer } from '../../oauth2';
import { SecurityService } from '../../services/identity/SecurityService';
import { UserService } from '../../services/identity/UserService';
import Logger from "../../lib/Logger";

const logger = Logger(module)

const router = express.Router();

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
    const clientId = options.clientID || __SERVER_CONFIG__.identity.social[provider].client_id as string;
    const secret = options.clientSecret || __SERVER_CONFIG__.identity.social[provider].client_secret;
    const userProfileURL = options.profileUrl
        || __SERVER_CONFIG__.identity.social[provider].profile_url
        || __SERVER_CONFIG__.host + '/oauth2/userinfo';
    const authorizationURL = options.authorizationURL
        || __SERVER_CONFIG__.identity.social[provider].authorize_url
        || __SERVER_CONFIG__.host + '/oauth2/authorize';
    const tokenURL = options.tokenURL
        || __SERVER_CONFIG__.identity.social[provider].token_url
        || __SERVER_CONFIG__.host + '/oauth2/token';
    const callbackURL = options.callbackURL
        || __SERVER_CONFIG__.identity.social[provider].callback_url
        || __SERVER_CONFIG__.host + `/login/${provider}/cb`;


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
            return done(null, {
                profile: profile,
                userId: idpConnect.userId,
                provider: provider
            });
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
                    logger.debug("it was an origianl oauth request:", oauthRequest);
                    /**
                     * original login request originated as oauth2
                     */
                    oauthRequest.user = { id: user.userId };
                    oauthRequest.isAuthorizationApproved = true;
                    oauthRequest.redirectUri = __SERVER_CONFIG__.appHost + '/accounting/dashboard';

                    securityService.createUserSession(req, resp, { id: user.userId, ...user });
                    const oauthResponse = await authorizationServer.completeAuthorizationRequest(oauthRequest);
                    /**
                     * clear the original oauth2 session context
                     */
                    req.session.oauth2 = undefined;
                    return handleExpressResponse(resp, oauthResponse)
                } else {
                    const loginRedir = __SERVER_CONFIG__.appHost + '/accounting/dashboard'

                    /**
                     * user is loggedin, lets create a session
                     */
                    securityService.createUserSession(req, resp, { id: user.userId, ...user });                    
                    logger.debug("callback: login user:", user.userId);
                    logger.debug("callback: redirecting to ", loginRedir);
                    resp.redirect(loginRedir);
                }
                return;
            } else {

                logger.debug("callback: its an error:", err);
                logger.debug("callback: redirecting to ", (__SERVER_CONFIG__.appHost + '/identity/login'));
                resp.redirect(__SERVER_CONFIG__.appHost + '/identity/login');
                return;

            }
        });
        passportHandler(req, resp);
    }
}
const idpLoginHandler = (provider: string, scopes: string[]): RequestHandler => {
    return async (req, resp) => {
        //
        //TODO: create a session if required that can be used on the callback
        // i.e all the PKCE related params, redirect_uri etc..
        //
        passport.authenticate(provider, { session: false, scope: scopes })(req, resp);
    }
}

for (const providerName in __SERVER_CONFIG__.identity.social) {
    const providerConfig = __SERVER_CONFIG__.identity.social[providerName];
    if (providerConfig.type === 'google') {
        passport.use(providerName,
            new google.Strategy({
                clientID: __SERVER_CONFIG__.identity.social[providerName].client_id,
                clientSecret: __SERVER_CONFIG__.identity.social[providerName].client_secret,
                callbackURL: __SERVER_CONFIG__.host + `/login/${providerName}/cb`,
                state: true
            }, idpConnectCallback(providerName))
        );        
    } else if (providerConfig.type === 'github') {
        passport.use(providerName,
            new github.Strategy({
                clientID: __SERVER_CONFIG__.identity.social[providerName].client_id,
                clientSecret: __SERVER_CONFIG__.identity.social[providerName].client_secret,
                callbackURL: __SERVER_CONFIG__.host + `/login/${providerName}/cb`
            }, idpConnectCallback(providerName))
        );
    } else if (providerConfig.type === 'w3l') {
        passport.use(providerName, W3lOAuthStrategy({
            clientID: __SERVER_CONFIG__.identity.social[providerName].client_id,
            clientSecret: __SERVER_CONFIG__.identity.social[providerName].client_secret,
            callbackURL: __SERVER_CONFIG__.host + `/login/${providerName}/cb`
        }, providerName));
    }

    router.get(`/login/federated/${providerName}`, idpLoginHandler(providerName, providerConfig.scopes));
    router.get(`/login/${providerName}/cb`, idpCallbackHandler(providerName));
}


module.exports = router
