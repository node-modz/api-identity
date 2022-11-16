import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "../resolvers/identity/hello-resolver";
import { AuthResolver } from "../resolvers/identity/auth-resolver";
import { AppContext } from "./init-context";
import { BankActivityResolver } from "../resolvers/accounting/bank-activity-resolver";
import { User } from "../entities/identity";
import { Container } from "typedi";
import Logger from '../lib/Logger'

const logger = Logger(module);

const init = async (ctx: AppContext) => {
  logger.info(ctx.name, ": init apollo: ");
  const app = ctx.http;
  const redisClient = ctx.redis;
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver, 
        AuthResolver, 
        BankActivityResolver
      ],
      validate: false,
      container: Container,
    }),
    context: async (props) => {
      const { req, res } = props;      
      return { 
        req, 
        res, 
        redis:redisClient,
        user: req.user,
      };
    },
  });
  server.applyMiddleware({ app, cors: false });
  logger.info(ctx.name, ": init apollo: done");
};

export { init as initApollo };
export default init;
