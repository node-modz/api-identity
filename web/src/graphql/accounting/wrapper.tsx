import { BankActivityQuery, BankActivityQueryVariables, useBankActivityQuery } from './graphql'
import * as Urql from 'urql';
import { ViewContext, authCheck } from '../GraphQLAuth'

export function useBankActivityQueryWrapper(
    options: Omit<Urql.UseQueryArgs<BankActivityQueryVariables>, 'query'>,
    context: ViewContext,   
) : Urql.UseQueryResponse<BankActivityQuery, BankActivityQueryVariables> {
    const resp = useBankActivityQuery(options)
    const [{ fetching, error }] = resp;
    authCheck({ context, fetching, error })
    return resp;
}

