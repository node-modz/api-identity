import cors, { CorsOptionsDelegate } from "cors";
import express from "express";
import morgan from 'morgan';
import Container from "typedi";
import Logger from "../lib/Logger";
import { AppContext } from "./init-context";

const logger = Logger(module)

export type HttpConfigOptions = {
  cors_allow_domains?: string[]
  views?: string
  session: {
    redis_store: string,
    cookie_secret: string,
    cookie_name: string,
    cookie_max_age: number
  }
}

const init = async (ctx: AppContext, config:HttpConfigOptions) => {

  logger.info(ctx.name, ": init http: ")
  
  Container.set('HttpConfigOptions',config);

  const app = ctx.http = express();

  app.set('view engine', 'ejs');
  app.set('views', config.views);

  applyMorganMiddleWare(ctx,config);
  applyCorsMiddleWare(ctx,config);

  app.set("trust proxy", 1);
  ctx.http = app;
  logger.info(ctx.name, ": init http: done");
}


const applyMorganMiddleWare = (ctx: AppContext, config:HttpConfigOptions) => {
  const app = ctx.http;

  // app.use(morgan('dev'))
  // https://github.com/expressjs/morgan#immediate
  app.use(morgan(':method :url ', {
    immediate: true,
    stream: {
      write: (message) => {
        logger.http(message.trim());
      }
    }
  }));

  // Logs responses
  app.use(morgan(':method :url  :status :res[content-length] :response-time ms', {
    stream: {
      write: (message) => {
        logger.http(message.trim());
      }
    }
  }));
}

const applyCorsMiddleWare = (ctx: AppContext, config:HttpConfigOptions) => {
  const app = ctx.http;

  if ( config.cors_allow_domains ) {
    const corsOptionsDelegate: CorsOptionsDelegate = function (req: cors.CorsRequest, callback) {
      const origin = req.headers.origin!
  
      const allowlist = config.cors_allow_domains as string[]
      const exists =
        (origin === undefined)
          ? -1
          : allowlist.findIndex((s) => { return origin.includes(s) });
  
      var corsOptions =
        (exists != -1)
          ? { origin: true, methods: ['GET', 'POST'], credentials: true }   // allow the request. 
          : { origin: false };                                              // disable CORS for this request
      callback(null, corsOptions); // callback expects two parameters: error and options
    }
  
    app.use(cors(corsOptionsDelegate));
  }  
}



export { init as initHttp };
export default init