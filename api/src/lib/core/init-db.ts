
import Container from "typedi";
import { createConnection, useContainer } from "typeorm";
import * as OrmExt from 'typeorm-typedi-extensions'
import Logger from './logger/Logger';
import { DBConfigOptions } from "./config/DBConfigOptions";
import { AppContext } from "./AppContext";

const logger = Logger(module);

const init = async (appCtxt: AppContext) => {

  const dbConfig: DBConfigOptions = Container.get('DBConfigOptions');
  
  logger.info(appCtxt.name, ": init db config:", dbConfig );
  
  useContainer(OrmExt.Container);
  
  logger.debug("entity locations:", dbConfig.entities);

  const conn = await createConnection({
    type: dbConfig.type as any,
    url: dbConfig.url,
    logging: dbConfig.logging,
    // synchronize: true,
    migrations: dbConfig.migrations,    
    entities: dbConfig.entities,
  });  
  logger.info(appCtxt.name, ": init db: done");
};


export default init;
