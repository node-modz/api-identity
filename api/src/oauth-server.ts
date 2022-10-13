import "dotenv/config";



import initApp from "./app/init-context";
import minimist from 'minimist'

const main = async () => {
    const argv = minimist(process.argv.slice(2));
    console.log("start oauth-server:",__dirname);  
    console.dir(argv)
  
    const appCtxt = initApp("ledgers-oauth2");
    for ( const file of [
      "./app/init-db",
      "./app/init-http",
      "./app/init-oauth",
    ]) {
      await require(file).default(appCtxt)
    }

    appCtxt.http.listen(3000,()=>{
        console.log("ledgers-oauth2 listening on: 3000")
    });
}

main().catch((e) =>{
    console.error("ledgers-oauth2: error",e)
});
