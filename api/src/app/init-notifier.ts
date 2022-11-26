import Container from "typedi";
import Logger from "../lib/Logger";
import { AppContext } from "./init-context";

const logger = Logger(module)

export type NotifierConfigOptions = {
    email: {
        host: string,
        port: number,
        secure:boolean,
        user: string,
        password: string
    }
}

const init = async( ctx: AppContext, config:NotifierConfigOptions) => {
    logger.info(ctx.name,": init notifier:");
    Container.set('NotifierConfigOptions',config);
    logger.info(ctx.name,": init notifier: done");   
}

export default init