import { ApolloServer } from "apollo-server-express";
import path from "path";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import Logger from '../logger/Logger';
import { AppContext } from "./AppContext";
import * as ioRedis from "ioredis";
import { GraphqQLConfig } from "./config/GraphqQLConfig";

const logger = Logger(module);

const init = async (ctx: AppContext ) => {

  const config:GraphqQLConfig= Container.get('GraphQLConfigOptions');

  logger.info(ctx.name, ": init apollo: ");
  logger.debug(config.resolvers);

  const app = ctx.http;
  const redisClient:ioRedis.Redis = ctx.redis;

  if ( config.resolvers ) {
    const server = new ApolloServer({
      schema: await buildSchema({      
        resolvers: config.resolvers,
        validate: false,
        container: Container,
      }),
      context: async (props) => {
        const { req, res } = props;
        return {
          req,
          res,
          redis: redisClient,
          user: req.user,
        };
      },
    });
    server.applyMiddleware({ app, cors: false });
  }
  
  logger.info(ctx.name, ": init apollo: done");
};

export { init as initApollo };
export default init;
