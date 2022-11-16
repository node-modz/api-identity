import "dotenv/config";



import initApp from "./app/init-context";
import minimist from 'minimist'
import Logger from './lib/Logger'

const logger = Logger(module);

const main = async () => {
    const argv = minimist(process.argv.slice(2));
    logger.info("start oauth-server:",__dirname);  
   //console.dir(argv)
  
    const appCtxt = initApp("ledgers-oauth2");
    for ( const file of [
      "./app/init-db",
      "./app/init-http",
      "./app/init-oauth2",
    ]) {
      await require(file).default(appCtxt)
    }

    const port = 4001;
    appCtxt.http.listen(port,()=>{
        logger.info("ledgers-oauth2 listening on:", port)
    });
}

main().catch((e) =>{
    logger.error("ledgers-oauth2: error",e)
});
