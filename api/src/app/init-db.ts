
import { ConnectionOptions, createConnection, useContainer } from "typeorm";
import { AppContext } from "./init-context";
import { __SERVER_CONFIG__ } from "./app-constants";
import { Container } from 'typeorm-typedi-extensions';
import Logger from '../lib/Logger'

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
    // logging: true,
    // synchronize: true,
    migrations: dbConfig.migrations,    
    entities: dbConfig.entities,
  });  
  logger.info(appCtxt.name, ": init db: done");
};


export default init;
