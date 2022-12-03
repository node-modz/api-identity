import dotenv from 'dotenv-safe';
import minimist from 'minimist';
import Container from 'typedi';
import initApp from "../init-context";
import { ServerConfigOptions } from "../config/ServerConfigOptions";
import Logger from '../logger/Logger';

const logger = Logger(module);

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  dotenv.config();
  logger.info("start api-server __dirname:", __dirname);
  logger.info("start api-server process.cwd():", process.cwd());

  const file = argv["init"];
  const rfile = (file) ? process.cwd() + "/" + file.replace(/\.[^/.]+$/, "") : '';
  if ( !file ) {
    logger.error("server config missing: --init <file>")
    return;
  }
  logger.info("starting server using config:", rfile);

  const descendentProperty = (obj:any, desc:string) => {
    var arr = desc.split(".");
    while(arr.length && (obj = obj[arr.shift() as string]));
    return obj;
  }

  const server = require(rfile).__SERVER_CONFIG__;
  /**
   * initialize the config in.
   */
  for ( const attr of server.config as {prop:string,container_ref:string}[] ) {
    Container.set(
      attr.container_ref,
      descendentProperty(server,attr.prop));
  }

  /**
   * bootup app.
   */
  const appCtxt = initApp("ledgers-api");
  for (const mod of server.setup as { init: string, config: string }[]) {
    await require(process.cwd() + "/"+ mod.init).default(appCtxt)
  }

  const serverConfig:ServerConfigOptions = Container.get('ServerConfigOptions')
  logger.info('ServerConfigOptions', serverConfig);
  appCtxt.http.listen(serverConfig.port, () => {
    logger.info("ledgers-api listening on: ", serverConfig.port);
  });
};

main().catch((e) => {
  console.error("ledgers-api error:", e);
});

