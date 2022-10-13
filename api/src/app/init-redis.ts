import { AppContext } from "./init-context";
import connectRedis from "connect-redis";
import session from "express-session";
import { __COOKIE_MAX_AGE__, __COOKIE_NAME__, __prod__, __REDIS_SERVER__, __SESSION_SECRET__ } from "./app-constants";
import Redis from "ioredis";



const init = async (ctx: AppContext) => {

  console.log(ctx.name,": init redis: ",__REDIS_SERVER__);
  console.log(ctx.name,": init redis: connecting to redis client: ");
  
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
        domain: __prod__ ? ".codeponder.com" : undefined,
      },
      saveUninitialized: false,
      secret: __SESSION_SECRET__,
      resave: false,
    })
  );

  ctx.redis = redis;
  console.log(ctx.name,": init redis: done")
};

export { init as initRedis };
export default init;
