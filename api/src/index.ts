import initApp from "./app/init-context";

const main = async () => {
  console.log("start neoledgers");

  const app = initApp();
  for ( const file of [
    "./app/init-db",
    "./app/init-http",
    "./app/init-redis",
    "./app/init-apollo",
  ]) {
    await require(file).default(app)
  }
     
  app.http.listen(4000, () => {
    console.log("ledgers-api listening on: 4000");
  });
};

main().catch((e) => {
  console.error("main error:", e);
});
