import Container from "typedi";
import Logger from "../lib/Logger";
import { AppContext } from "./init-context";

const logger = Logger(module)

export type ServerConfigOptions = {
    host: string
    port: number
}

const init = async( ctx: AppContext, config:ServerConfigOptions) => {
    logger.info(ctx.name,": init server:");
    Container.set('ServerConfigOptions',config);
    logger.info(ctx.name,": init server: done");   
}

export default init