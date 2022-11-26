
import { ConnectionOptions, createConnection, useContainer } from "typeorm";
import { Container } from 'typeorm-typedi-extensions';
import Logger from '../lib/Logger';
import { AppContext } from "./init-context";

const logger = Logger(module);

export type DBConfigOptions = ConnectionOptions & {  
  url?:string  
}

const init = async (appCtxt: AppContext, dbConfig: DBConfigOptions ) => {
  logger.info(appCtxt.name, ": init db config:", dbConfig );
  
  useContainer(Container);
 
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
