import express from "express";

import * as ioRedis from "ioredis";


export class AppContext {
  name: string
  http: express.Express;
  redis: ioRedis.Redis;
}
const init = (name:string): AppContext => {
  const appCtxt = new AppContext();
  appCtxt.name = name
  return appCtxt
};

export { init as createAppContext }
export default init ;