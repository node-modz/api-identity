import initApp from "./app/init-context";
import minimist from 'minimist'

const main = async () => {
  const argv = minimist(process.argv.slice(2));
  console.log("start api-server:",__dirname);  
  console.dir(argv)

  const appCtxt = initApp("ledgers-api");
  for ( const file of [
    "./app/init-db",
    "./app/init-http",
    "./app/init-redis",
    "./app/init-apollo",
  ]) {
    await require(file).default(appCtxt)
  }
     
  const port = 4000;
  appCtxt.http.listen(port, () => {
    console.log("ledgers-api listening on: ", port);
  });
};

main().catch((e) => {
  console.error("ledgers-api error:", e);
});
