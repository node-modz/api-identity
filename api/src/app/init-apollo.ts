import { ApolloServer } from "apollo-server-express";
import { PostResolver } from "../resolvers/post-resolver";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "../resolvers/hello-resolver";
import { UserResolver } from "../resolvers/user-resolver";
import { AppContext } from "./init-context";
import { BankActivityResolver } from "../resolvers/bank-activity-resolver";

const init = async (ctx: AppContext) => {
  console.log("init apollo: ");
  const app = ctx.http;
  const redisClient = ctx.redis;
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver, PostResolver, BankActivityResolver],
      validate: false,
    }),
    context: (props) => {
      const { req, res } = props;
      return { req, res, redis:redisClient };
    },
  });
  server.applyMiddleware({ app, cors: false });
  console.log("init apollo: done");
};

export { init as initApollo };
export default init;
