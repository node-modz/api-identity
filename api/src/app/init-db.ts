import path from "path";
import { createConnection, useContainer } from "typeorm";
import { AppContext } from "./init-context";
import { __SERVER_CONFIG__ } from "./app-constants";
import { Container } from 'typeorm-typedi-extensions';
import Logger from '../lib/Logger'

const logger = Logger(module);

const init = async (appCtxt: AppContext) => {
  logger.info(appCtxt.name, ": init db:", __SERVER_CONFIG__.db.url );
  useContainer(Container);
  const entityLocations = [
    path.join(__dirname, '../components/identity/entities/**/*.js'),    
    path.join(__dirname, '../components/dacchain/entities/*'),
    path.join(__dirname, '../components/accounting/entities/*'), 
    path.join(__dirname, '../entities/*')
  ];
  logger.debug("entity locations:", entityLocations);

  const conn = await createConnection({
    type: "postgres",
    url: __SERVER_CONFIG__.db.url,
    // logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "../migrations/*")],
    // entities: [User, Post, BankActivity,Tenant],
    entities: entityLocations,
  });  
  logger.info(appCtxt.name, ": init db: done");
};


export default init;
