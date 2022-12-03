import { default as express, default as Express, Router } from 'express';
import * as jose from 'node-jose';
import { Container, Inject, Service } from 'typedi';
import { EntityNotFoundError } from "typeorm";
import { User } from "../entities/identity/User";
import { AuthorizationServer, DateInterval, JwtKeyStoreService, OAuthException } from "../lib/oauth2";
import {
    handleExpressError,
    handleExpressResponse, requestFromExpress
} from '../lib/oauth2/adapters/express';

import { IdentityConfigOptions } from "../config/IdentityConfigOptions";
import { ServerConfigOptions } from "../../../lib/core/config/ServerConfigOptions";
import Logger from "../../../lib/logger/Logger";
import { SecurityService } from '../services/identity/SecurityService';
import { UserService } from '../services/identity/UserService';
import {
    AuthCodeRepository,
    ClientRepository,
    ScopeRepository,
    TokenRepository,
    UserRepository
} from "../services/oauth2";
import { wellknown } from './wellknown';

const logger = Logger(module)


@Service()
class OAuthController {

    @Inject('IdentityConfigOptions')
    public readonly identityConfig: IdentityConfigOptions

    @Inject('ServerConfigOptions')
    public readonly serverConfig: ServerConfigOptions

    constructor(
        @Inject()
        private readonly securityService: SecurityService,
        @Inject('JwtService')
        private readonly jwtService: JwtKeyStoreService,
        @Inject()
        private readonly authCodeRepository: AuthCodeRepository,
        @Inject()
        private readonly clientRepository: ClientRepository,
        @Inject()
        private readonly tokenRepository: TokenRepository,
        @Inject()
        private readonly scopeRepository: ScopeRepository,
        @Inject()
        private readonly userRepository: UserRepository,
        @Inject()
        private readonly userService: UserService,
        @Inject()
        private authorizationServer: AuthorizationServer
    ) { }

    /**
     *  /idp/login
     */
    public login() {
        return async (req: Express.Request, res: Express.Response) => {
            const { username, password } = req.body
            const user = await this.userService.findByCredentials(username, password);
            if (!user) {
                /**
                 * invalid credentials show the login page.
                 */
                res.render(
                    'idp/login', {
                    error: 'invalid credentials'
                });
            } else {
                /**
                 * valid credentials, use the original authRequest & generate authCode
                 */
                const authRequest = req.session.oauth2?.request;
                if (!authRequest) {                    
                    res.render(
                        'idp/login', {
                        error: 'invalid oauth2 session, re-initiate authorize flow'
                    });
                    return;
                }

                authRequest.user = user;
                authRequest.isAuthorizationApproved = true;

                /**
                 * respond with auth_code
                 */
                const oauthResponse = await this.authorizationServer.completeAuthorizationRequest(authRequest);

                /**
                 * create a user session, so that subsequent auth requests do not ask for 
                 * clear the original oauth2 request
                 */
                this.securityService.createUserSession(req, res, user);
                req.session.oauth2 = undefined;

                return handleExpressResponse(res, oauthResponse);
            }
        }
    }


    /**
     *  /oauth2/authorize
     */
    public authorize() {
        return async (req: Express.Request, res: Express.Response) => {
            try {
                const authRequest = await this.authorizationServer.validateAuthorizationRequest(requestFromExpress(req));
                const user = await this.securityService.getLoggedInUser(req);
                if (user) {
                    /** 
                     * existing session; lets send the cookie already. 
                     */
                    logger.debug(`logged in user ${user}`);
                    authRequest.user = user;
                    authRequest.isAuthorizationApproved = true;
                    const oauthResponse = await this
                        .authorizationServer
                        .completeAuthorizationRequest(authRequest);
                    return handleExpressResponse(res, oauthResponse);
                } else {
                    /**
                    * record an oauth2 session, which is used on a successfull login to send to redirect_uri
                    */
                    req.session.oauth2 = { request: authRequest }
                    logger.info('auth params:',{ui:req.query.ui,idp:req.query.idp});
                    
                    if( req.query.ui ) {
                        logger.info('redirect to:',req.query.ui)
                        res.redirect(req.query.ui as string)
                    } else if ( req.query.idp ) {
                        res.redirect(`/login/federated/${req.query.idp}`)
                    } else {
                        res.render('idp/login', { error: false });
                    }                    
                }
            } catch (e) {
                logger.error("Exception while processing token:", e);
                if (e instanceof OAuthException) {
                    handleExpressError(e, res);
                } else if (e instanceof EntityNotFoundError) {
                    res.status(404).json({ error: { message: 'invalid client' } });
                } else {
                    res.status(500).json({ error: { message: 'internal error' } })
                }
                return;
            }
        }
    }

    /**
     *  /oauth2/token
     */
    public token() {
        return async (req: Express.Request, res: Express.Response) => {
            try {
                const oauthResponse = await this
                    .authorizationServer
                    .respondToAccessTokenRequest(req);
                return handleExpressResponse(res, oauthResponse);
            } catch (e) {
                logger.error("Exception while processing token:", e);
                if (e instanceof OAuthException) {
                    handleExpressError(e, res);
                } else if (e instanceof EntityNotFoundError) {
                    res.status(404).json({ error: { message: 'invalid client' } });
                } else {
                    res.status(500).json({ error: { message: 'internal error' } })
                }
                return;
            }
        }
    }

    /**
     *  /oauth2/userinfo
     */
    public userinfo() {
        return (req: Express.Request, res: Express.Response) => {
            /**
             * get the user from request. would have been populated by init-session middleware.
             */
            const u = req.user;
            if (!u) {
                res.status(404).json({ error: { message: 'invalid user' } })
            } else {
                const user = u as User;
                res.json({
                    avatar: user.avatar,
                    id: user.id,
                    name: {
                        familyName: user.lastName,
                        givenName: user.firstName
                    }
                });
            }
        }
    }

    /**
     *  /oauth2/logout
     */
    public logout() {
        return (req: Express.Request, res: Express.Response) => {
            /**
             * clear session & cookie
             */
            this.securityService.clearSession(req, res);

            /**
             * send the user back to the app.
             */
            const redir_uri = req.query["post_logout_redirect_uri"] as string;
            (redir_uri) ? res.redirect(redir_uri) : res.redirect('/');
        }
    }

    /**
     *  /oauth2/verify
     */
    public introspect() {
        return async (req: Express.Request, res: Express.Response) => {
            const { token } = req.body;
            try {
                const payload = await this.jwtService.verify(token);
                if (payload) {
                    const exp = payload['exp'] ? payload['exp'] as number : 0;
                    if (Date.now() >= exp * 1000) {
                        res.json({ active: false })
                    } else {
                        res.send(payload)
                    }
                } else {
                    res.send({ token: token, invalid: true, active: false });
                }
            } catch (e) {
                console.log("error while verifying:", e)
                res.status(500).send({
                    token: token,
                    error: 'invalid token',
                    invalid: true,
                    active: false
                })
            }
        }
    }

    /**
     *  /oauth2/.wellknown/openid-configuration
     */
    public wellKnown(prefix: string) {
        return async (req: Express.Request, res: Express.Response) => {
            const host = this.serverConfig.host + prefix
            res.json(wellknown(host));
        }
    }

    /**
     *  /oauth2/jwks.json
     */
    public jwks() {
        return async (req: Express.Request, res: Express.Response) => {
            res.send(this.jwtService.keyStore.toJSON());
        }
    }
}


export const initRoutes = (prefix: string, keyStore: jose.JWK.KeyStore): Router => {
    const router = express.Router();

    Container.set('JwtService', new JwtKeyStoreService(keyStore));

    const authorizationServer = new AuthorizationServer(
        Container.get(AuthCodeRepository),
        Container.get(ClientRepository),
        Container.get(TokenRepository),
        Container.get(ScopeRepository),
        Container.get(UserRepository),
        Container.get('JwtService')
    );
    authorizationServer.enableGrantTypes(
        ["authorization_code", new DateInterval("15m")],
        ["client_credentials", new DateInterval("1d")],
        "refresh_token",
        "password",
        "implicit",
    );
    Container.set(AuthorizationServer, authorizationServer);

    const oauthController = Container.get(OAuthController);
    
    /**
     * idp/login post
     */
    router.post('/idp/login', oauthController.login());

    /**
     * oauth2 routes.
     *   /.well-known/openid-configuration
     *   /.well-known/jwks.json
     *   /authorize
     *   /token
     *   /userinfo
     *   /verify
     *   /logout
     * 
     *   client ->   get: /authorize
     *            render: /idp/login
     *          ->  post: /idp/login username&password
     *                    redir: client?code=xx
     *          ->   get: /token?grant_type=authorization_code&code=xx ..
     *                    return: { token... }
     */
    router.get(prefix + "/.well-known/openid-configuration", oauthController.wellKnown(prefix));
    router.get(prefix + "/.well-known/jwks.json", oauthController.jwks());
    router.post(prefix + "/verify", oauthController.introspect());
    router.get(prefix + "/authorize", oauthController.authorize());
    router.post(prefix + "/token", oauthController.token());
    router.get(prefix + "/userinfo", oauthController.userinfo());
    router.get(prefix + "/logout", oauthController.logout());

    return router;
}