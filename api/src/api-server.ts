import dotenv from 'dotenv-safe';
import minimist from 'minimist';
import initApp from "./app/init-context";
import Logger from './lib/Logger'

const logger = Logger(module);

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  dotenv.config();
  logger.info("start api-server:", __dirname);
  //console.dir(argv)

  const appCtxt = initApp("ledgers-api");
  for (const file of [
    "./app/init-db",
    "./app/init-http",
    "./app/init-session",
    "./app/init-apollo",
    "./app/init-identity",
    "./app/init-oauth2",
  ]) {
    await require(file).default(appCtxt)
  }

  const port = 4000;
  appCtxt.http.listen(port, () => {
    logger.info("ledgers-api listening on: ", port);
  });
};

main().catch((e) => {
  console.error("ledgers-api error:", e);
});

