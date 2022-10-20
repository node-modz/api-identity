import { BankActivityQuery, BankActivityQueryVariables, useBankActivityQuery } from './accounting/graphql'
import * as Urql from 'urql';
import { ViewContext, authCheck } from './GraphQLAuth'


export function useQueryWrapper<Query,Variables>(
    query: (options: Omit<Urql.UseQueryArgs<Variables>, 'query'>) => Urql.UseQueryResponse<Query,Variables>,
    options:  Omit<Urql.UseQueryArgs<Variables>, 'query'>,
    context:ViewContext
) : Urql.UseQueryResponse<Query,Variables> {
    const resp = query(options)
    const [{ fetching, error }] = resp;
    authCheck({ context, fetching, error })
    return resp;
}

