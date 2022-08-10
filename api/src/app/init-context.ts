import express from "express";

import * as ioRedis from "ioredis";


export class AppContext {
  http: express.Express;
  redis: ioRedis.Redis;
}
const init = (): AppContext => {
  return new AppContext();
};

export { init as createAppContext }
export default init ;