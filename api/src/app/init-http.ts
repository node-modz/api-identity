import cors, { CorsOptionsDelegate } from "cors";
import express from "express";
import { __CORS_ALLOW_DOMAINS__ } from "./app-constants";
import { AppContext } from "./init-context";

const init = async (ctx: AppContext) => {

  console.log(ctx.name,": init http: ")
  const app = express();
  console.log(ctx.name,"cors domains:", __CORS_ALLOW_DOMAINS__)
  
  const  corsOptionsDelegate:CorsOptionsDelegate = function (req: cors.CorsRequest, callback) {
    const origin = req.headers.origin!

    // https://expressjs.com/en/resources/middleware/cors.html#configuring-cors-w-dynamic-origin  
    const allowlist = [
      __CORS_ALLOW_DOMAINS__,   // from the web. TODO: move this to process.env variable.
      'app://',                 // requests from packaged electron app
    ]    
    const exists = allowlist.findIndex((s)=>{return origin.includes(s)})
    var corsOptions = (exists != -1 ) 
      ? { origin: true, methods:['GET','POST'], credentials: true } 
      : { origin: false } // disable CORS for this request
    callback(null, corsOptions) // callback expects two parameters: error and options
  }

  app.use(
    cors(corsOptionsDelegate)
  );
  app.set("trust proxy", 1);
  ctx.http = app;
  console.log(ctx.name, ": init http: done")
}

export { init as initHttp }
export default init