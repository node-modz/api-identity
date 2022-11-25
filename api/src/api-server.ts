import dotenv from 'dotenv-safe';
import minimist from 'minimist';
import initApp from "./app/init-context";
import Logger from './lib/Logger';

import { __SERVER_CONFIG__ } from './api-config';

const logger = Logger(module);

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  dotenv.config();
  logger.info("start api-server:", __dirname);

  const appCtxt = initApp("ledgers-api");

  const config = require('./api-config').__SERVER_CONFIG__;

  for (const mod of config.modules as { module: string, config: string }[]) {
    await require(mod.module).default(appCtxt, (__SERVER_CONFIG__ as any)[mod.config])
  }

  //const port = 4000;
  appCtxt.http.listen(__SERVER_CONFIG__.port, () => {
    logger.info("ledgers-api listening on: ", __SERVER_CONFIG__.port);
  });
};

main().catch((e) => {
  console.error("ledgers-api error:", e);
});

