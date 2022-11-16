import { Service } from 'typedi';
import { User } from "../../entities/identity";
import express from "express";
import { __COOKIE_NAME__ } from '../../app/app-constants';
import Logger from "../../lib/Logger";

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
        res.clearCookie(__COOKIE_NAME__);
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