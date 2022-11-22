import { ApolloServer } from "apollo-server-express";
import path from "path";
import { buildSchema, NonEmptyArray } from "type-graphql";
import { Container } from "typedi";
import Logger from '../lib/Logger';
import { AppContext } from "./init-context";

const logger = Logger(module);

export type GraphqQLConfig = {
  resolvers?: NonEmptyArray<string>
}

const init = async (ctx: AppContext, config:GraphqQLConfig={} ) => {
  logger.info(ctx.name, ": init apollo: ");
  logger.debug(config.resolvers);

  const app = ctx.http;
  const redisClient = ctx.redis;

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
