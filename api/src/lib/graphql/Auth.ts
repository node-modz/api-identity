import { GraphQLReqContext } from "src/lib/graphql/GraphQLReqContext";
import { ApolloError } from "apollo-server-express";
import { GraphQLError } from "graphql";
import { MiddlewareFn } from 'type-graphql'

export const isUserAuth: MiddlewareFn<GraphQLReqContext> = async ({ context }, next) => {
    if (!context.user) {
        throw new GraphQLError("not authenticated.",
            null, null, null, null, null, {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
        })
    }
    return next();
}