import cors, { CorsOptionsDelegate } from "cors";
import express from "express";
import { __CORS_ALLOW_DOMAINS__ } from "./app-constants";
import { AppContext } from "./init-context";
import morgan from 'morgan';
import path from 'path';
import Logger from "../lib/Logger";

const logger = Logger(module)


const init = async (ctx: AppContext) => {

  logger.info(ctx.name, ": init http: ")
  const app = ctx.http = express();

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));

  applyMorganMiddleWare(ctx);
  applyCorsMiddleWare(ctx);

  app.set("trust proxy", 1);
  ctx.http = app;
  logger.info(ctx.name, ": init http: done");
}


const applyMorganMiddleWare = (ctx: AppContext) => {
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

const applyCorsMiddleWare = (ctx: AppContext) => {
  const app = ctx.http;

  const corsOptionsDelegate: CorsOptionsDelegate = function (req: cors.CorsRequest, callback) {
    const origin = req.headers.origin!

    const allowlist = [
      __CORS_ALLOW_DOMAINS__,   // from the web. TODO: move this to process.env variable.
      'app://',                 // requests from packaged electron app
    ]
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

export { init as initHttp }
export default init