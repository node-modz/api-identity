import path from "path";
import { createConnection } from "typeorm";
import { AppContext } from "./init-context";
import { __LEDGERS_DB__ } from "./app-constants";

const init = async (appCtxt: AppContext) => {
  console.log(appCtxt.name, ": init db:", __LEDGERS_DB__);
  const conn = await createConnection({
    type: "postgres",
    url: __LEDGERS_DB__,
    // logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "../migrations/*")],
    // entities: [User, Post, BankActivity,Tenant],
    entities: [
      path.join(__dirname, '../entities/identity/*'),
      path.join(__dirname, '../entities/dacchain/*'),
      path.join(__dirname, '../entities/accounting/*'),
      path.join(__dirname, '../entities/dacns/*'),
      path.join(__dirname, '../entities/oauth2/*'),
      path.join(__dirname, '../entities/*')
    ],
  });  
  console.log(appCtxt.name, ": init db: done");
};


export default init;
