import path from "path";
import { User } from "../entities/User";
import { createConnection } from "typeorm";
import { AppContext } from "./init-context";
import { Post } from "../entities/Post";
import { __LEDGERS_DB__ } from "./app-constants";

import { BankActivity } from "../entities/BankActivity";
import { Tenant } from "../entities/Tenant";

const init = async (_: AppContext) => {
  console.log("init db:", __LEDGERS_DB__);
  const conn = await createConnection({
    type: "postgres",
    url: __LEDGERS_DB__,
    // logging: true,
    // synchronize: true,
    migrations: [path.join(__dirname, "../migrations/*")],
    // entities: [User, Post, BankActivity,Tenant],
    entities: [path.join(__dirname, '../entities/*')],
  });  
  console.log("init db: done");
};


export default init;
