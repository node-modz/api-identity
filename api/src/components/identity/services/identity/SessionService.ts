import { Service } from 'typedi';
import { User } from "../../entities/identity";
import express from "express";
import { __SERVER_CONFIG__ } from '../../../../api-config';
import Logger from "../../../../lib/Logger";

const logger = Logger(module)

@Service()
export class SessionService {
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
        res.clearCookie( __SERVER_CONFIG__.http.session.cookie_name );
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

}