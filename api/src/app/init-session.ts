import { AppContext } from "./init-context";
import connectRedis from "connect-redis";
import session from "express-session";
import { __COOKIE_MAX_AGE__, __COOKIE_NAME__, __prod__, __REDIS_SERVER__, __SESSION_SECRET__ } from "./app-constants";
import Redis from "ioredis";
import Container from "typedi";
import { SecurityService } from "../services/identity/SecurityService";
import Logger from '../lib/Logger'

const logger = Logger(module);



const init = async (ctx: AppContext) => {

  logger.info(ctx.name, ": init session: ", __REDIS_SERVER__);
  logger.info(ctx.name, ": init session: connecting to redis client: ");

  const app = ctx.http;
  const RedisStore = connectRedis(session);
  const redis = new Redis(__REDIS_SERVER__);

  app.use(
    session({
      name: __COOKIE_NAME__,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: __COOKIE_MAX_AGE__,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".w3l.com" : undefined,
      },
      saveUninitialized: false,
      secret: __SESSION_SECRET__,
      resave: false,
    })
  );
  applySessionMiddleWare(ctx);

  ctx.redis = redis;
  logger.info(ctx.name, ": init session: done")
};

const applySessionMiddleWare = (ctx: AppContext) => {
  const app = ctx.http;
  app.use(async (req, res, next) => {
    await Container.get(SecurityService)
      .loadAuthContext(req,res);
    next();
  });
}

export { init as initRedis };
export default init;
