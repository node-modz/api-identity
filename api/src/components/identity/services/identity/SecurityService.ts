import { Inject, Service } from 'typedi';
import { User } from "../../entities/identity";
import express from "express";
import { __SERVER_CONFIG__ } from '../../../../app/app-constants';
import Logger from "../../../../lib/Logger";
import { JwtKeyStoreService } from '../../lib/oauth2';

const logger = Logger(module)

@Service()
export class SecurityService {

    @Inject()
    private readonly jwtService: JwtKeyStoreService

    createUserSession(
        req: express.Request,
        res: express.Response,
        user: User
    ) {
        req.session.userId = user.id;
    }

    clearSession(
        req: express.Request,
        res: express.Response
    ): Promise<Boolean> {
        const userId = req.session.userId;
        logger.debug("logging out user: ", userId);
        res.clearCookie(__SERVER_CONFIG__.identity.cookie_name);
        return new Promise<Boolean>((res) => {
            req.session.destroy((err) => {
                if (err) {
                    console.log("unable to destroy session", err);
                    res(false);
                    return;
                }
                res(true);
            });
        });
    }

    isLoggedIn(req: express.Request): boolean {
        return req.session.userId !== undefined;
    }

    async getLoggedInUser(req: express.Request): Promise<User | undefined> {
        if (req.user) {
            return req.user as User;
        } else if (req.session.userId) {
            const user = await User.findOne({ where: { id: req.session.userId } })
            return user;
        }
        return undefined;
    }

    /**
     * load AuthContext onto request
     */
    async loadAuthContext(
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        // logger.debug("loading auth context", {
        //     headers: req.headers,
        //     session: req.session
        // });
        let authorization =
            req.headers.authorization !== undefined
                ? req.headers.authorization
                : ""
        if (!authorization) {
            /**
             *  no authorization header lets check the session
             */
            const userId = req.session.userId
            const user =
                (!userId)
                    ? undefined
                    : await User.findOne({ where: { id: userId } });

            if (user) {
                logger.debug("loading user from session:", { userId: userId, user: user });
                req.user = user;
                this.saveSessionContext(req, user);
            }
        } else {
            if (authorization.indexOf('Bearer') >= 0) {
                authorization = authorization.split(' ')[1];
            }
            let parts = authorization.split(".")
            if (parts.length == 3) {
                // its a JWT
                const payload = this.jwtService.decode(authorization);
                logger.debug("token payload:", payload);
                if (payload) {
                    const json = payload as { [key: string]: any }
                    const sub = json['sub'];
                    const cid = json['cid'];
                    const exp = json['exp'];
                    const scope = json['scope'];
                    const roles = json['roles'];

                    if (sub) {
                        if (Date.now() >= exp * 1000) {
                            logger.warn("token expired");
                            return;
                        }
                        /**
                         * this is a user based token because of subject.
                         */
                        const userId = sub;
                        const user =
                            (!userId)
                                ? undefined
                                : await User.findOne({ where: { id: userId } });
                        if (user) {
                            req.user = user;
                            this.saveTokenContext(req, {
                                sub: sub,
                                exp: exp,
                                scope: scope,
                                cid: cid,
                                user: {
                                    ...user
                                }
                            });
                        } else {
                            logger.warn(`error: user not found ${userId}`)
                        }

                    } else if (cid) {
                        /**
                         * this is a client i.e service-to-service token
                         */
                        this.saveTokenContext(req, {
                            sub: sub,
                            exp: exp,
                            scope: scope,
                            cid: cid,
                        });
                    }
                }
            } else {
                /**
                 * TODO: its an opaque access token.
                 *   1. read from db.
                 *   2. if( userToken ) { saveTokenContext( as user ) }
                 *      else { saveTokenContext( as client ) }
                 **/
            }

            logger.debug("request context: ", {
                header: { authorization: authorization.substring(0, 5) + "...", },
                session: req.session,
                user: req.user,
            });
        }
    }

    /**
     * save AuthContext on request
     */
    saveTokenContext(req: express.Request, token: Express.AuthToken): void {
        req.authContext = {
            context: "token",
            loaded: true,
            token: token
        };
    }
    saveSessionContext(req: express.Request, user: Express.AuthUser | undefined): void {
        req.authContext = {
            context: "session",
            loaded: true,
            user: user
        };
    }


    isClient(req: express.Request): boolean {
        const authContext = req.authContext;
        if (authContext
            && authContext.context == "token") {
            /**
             * if a user does not exist its a client token
             */
            return authContext.token!.user == undefined
        }
        return false;
    }

    isUser(req: express.Request): boolean {
        const authContext = this.getAuthContext(req);
        if (authContext
            && authContext.context == "token") {
            /**
             * if the user exists its a user accesstoken
             */
            return authContext.token!.user != undefined
        }
        return false;
    }

    hasScopes(scopes: string[]): boolean {
        return false;
    }

    hasRoles(roles: string[]): boolean {
        return false;
    }

    private getAuthContext(req: express.Request): Express.AuthContext | undefined {
        const authContext = req.authContext;
        if (authContext && authContext.loaded) {
            return authContext;
        }
        return undefined;
    }

}