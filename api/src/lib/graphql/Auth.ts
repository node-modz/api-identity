import { RequestContext } from "src/app/request-context";
import { ApolloError } from "apollo-server-express";
import { GraphQLError } from "graphql";
import { MiddlewareFn } from 'type-graphql'

export const isUserAuth: MiddlewareFn<RequestContext> = async ({ context }, next) => {
    if (!context.user) {
        throw new GraphQLError("not authenticated.",
            null, null, null, null, null, {
            code: 'UNAUTHENTICATED',
            http: { status: 401 },
        })
    }
    return next();
}