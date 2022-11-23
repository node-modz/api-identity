import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import Container from "typedi";
import { SecurityService } from "../components/identity/services/identity/SecurityService";
import Logger from '../lib/Logger';
import { __prod__, __SERVER_CONFIG__ } from "../api-config";
import { AppContext } from "./init-context";
import { HttpConfigOptions } from "./init-http";

const logger = Logger(module);

const init = async (ctx: AppContext, config: HttpConfigOptions) => {

  logger.info(ctx.name, ": init session: ", config.session.redis_store);
  logger.info(ctx.name, ": init session: connecting to redis client: ");

  const app = ctx.http;
  const RedisStore = connectRedis(session);
  const redis = new Redis(config.session.redis_store);

  app.use(
    session({
      name: config.session.cookie_name,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: config.session.cookie_max_age,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".w3l.com" : undefined,
      },
      saveUninitialized: false,
      secret: config.session.cookie_secret,
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
