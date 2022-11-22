import dotenv from 'dotenv-safe';
import minimist from 'minimist';
import initApp from "./app/init-context";
import Logger from './lib/Logger'
import db from './app/init-db'
import apollo from './app/init-apollo'
import http from './app/init-http'
import httpSession from './app/init-session'
import identity from './app/init-identity'

import { __SERVER_CONFIG__ } from './app/app-constants';

const logger = Logger(module);

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  dotenv.config();
  logger.info("start api-server:", __dirname);
    
  const appCtxt = initApp("ledgers-api");
  await db(appCtxt,__SERVER_CONFIG__.db);
  await http(appCtxt,__SERVER_CONFIG__.http)
  await httpSession(appCtxt,__SERVER_CONFIG__.http)
  await apollo(appCtxt,__SERVER_CONFIG__.apollo);
  await identity(appCtxt,__SERVER_CONFIG__.identity);
  //await require("./app/init-db").default(appCtxt,)
  // for (const file of [        
  //   "./app/init-identity",
  //   "./app/init-oauth2",
  // ]) {
  //   await require(file).default(appCtxt)
  // }
  

  const port = 4000;
  appCtxt.http.listen(port, () => {
    logger.info("ledgers-api listening on: ", port);
  });
};

main().catch((e) => {
  console.error("ledgers-api error:", e);
});

