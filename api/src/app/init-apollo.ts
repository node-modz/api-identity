import { ApolloServer } from "apollo-server-express";
import { PostResolver } from "../resolvers/identity/post-resolver";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "../resolvers/identity/hello-resolver";
import { AuthResolver } from "../resolvers/identity/auth-resolver";
import { AppContext } from "./init-context";
import { BankActivityResolver } from "../resolvers/accounting/bank-activity-resolver";

const init = async (ctx: AppContext) => {
  console.log(ctx.name, ": init apollo: ");
  const app = ctx.http;
  const redisClient = ctx.redis;
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, AuthResolver, PostResolver, BankActivityResolver],
      validate: false,
    }),
    context: (props) => {
      const { req, res } = props;
      return { req, res, redis:redisClient };
    },
  });
  server.applyMiddleware({ app, cors: false });
  console.log(ctx.name, ": init apollo: done");
};

export { init as initApollo };
export default init;
