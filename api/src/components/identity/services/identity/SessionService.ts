import express from "express";
import { Inject, Service } from 'typedi';
import { HttpConfigOptions } from "../../../../lib/core/config/HttpConfigOptions";
import Logger from "../../../../lib/core/logger/Logger";
import { User } from "../../entities/identity";

const logger = Logger(module)

@Service()
export class SessionService {
    @Inject('HttpConfigOptions')
    private readonly httpConfigOptions: HttpConfigOptions

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
        res.clearCookie( this.httpConfigOptions.session.cookie_name );
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