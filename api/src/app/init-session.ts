import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import Container from "typedi";
import { SecurityService } from "../components/identity/services/identity/SecurityService";
import Logger from '../lib/Logger';
import { __prod__, __SERVER_CONFIG__ } from "./app-constants";
import { AppContext } from "./init-context";

const logger = Logger(module);

const init = async (ctx: AppContext) => {

  logger.info(ctx.name, ": init session: ", __SERVER_CONFIG__.identity.session_store);
  logger.info(ctx.name, ": init session: connecting to redis client: ");

  const app = ctx.http;
  const RedisStore = connectRedis(session);
  const redis = new Redis(__SERVER_CONFIG__.identity.session_store);

  app.use(
    session({
      name: __SERVER_CONFIG__.identity.cookie_name,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: __SERVER_CONFIG__.identity.cookie_max_age,
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works in https
        domain: __prod__ ? ".w3l.com" : undefined,
      },
      saveUninitialized: false,
      secret: __SERVER_CONFIG__.identity.session_secret,
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
