import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";
import { BankActivityResolver } from "../components/accounting/revolvers/bank-activity-resolver";
import { AuthResolver } from "../components/identity/resolvers/auth-resolver";
import { HelloResolver } from "../components/identity/resolvers/hello-resolver";
import Logger from '../lib/Logger';
import { AppContext } from "./init-context";

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
