import cors from "cors";
import express from "express";
import { __CORS_ALLOW_DOMAINS__ } from "./app-constants";
import { AppContext } from "./init-context";

const init = async (ctx: AppContext) => {
    console.log("init http: ")
    const app = express();

  // configure cors: 
  // can be done dynamically as well: 
  //   https://expressjs.com/en/resources/middleware/cors.html#configuring-cors-w-dynamic-origin
  app.use(
    cors({
      origin: __CORS_ALLOW_DOMAINS__,
      credentials: true,
    })
  );
  app.set("trust proxy", 1);
  ctx.http = app;
  console.log("init http: done")
}

export { init as initHttp }
export default init