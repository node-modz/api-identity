import connectRedis from "connect-redis";
import session from "express-session";
import Redis from "ioredis";
import Container from "typedi";
import { SecurityService } from "../../components/identity/services/identity/SecurityService";
import Logger from './logger/Logger';
import { AppContext } from "./AppContext";
import { HttpConfigOptions } from "./config/HttpConfigOptions";
import express from "express";

const logger = Logger(module);
const __prod__ = process.env.NODE_ENV === 'production'

const init = async (ctx: AppContext) => {

  const config: HttpConfigOptions = Container.get('HttpConfigOptions');

  logger.info(ctx.name, ": init session: ", config.session.redis_store);
  logger.info(ctx.name, ": init session: connecting to redis client: ");

  const app:express.Express = ctx.http;
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
  const app:express.Express = ctx.http;
  app.use(async (req, res, next) => {
    await Container.get(SecurityService)
      .loadAuthContext(req,res);
    next();
  });
}

export { init as initRedis };
export default init;
