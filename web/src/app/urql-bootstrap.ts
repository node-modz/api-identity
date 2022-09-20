import { createClient, dedupExchange, fetchExchange, ssrExchange } from "urql";
import {
  cacheExchange,
  Cache,
  QueryInput,
  query,
  CacheExchangeOpts,
} from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
} from "../generated/graphql";
import { __GRAPHQL_API_SERVER__ } from "./app-constants";
import { devtoolsExchange } from "@urql/devtools";
import { isServerSide } from "../utils/utils";

declare global {
  interface Window {
    __URQL_DATA__:any
  }
}

function updateCache<R, Q>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: R, q: Q) => Q
) {
  return cache.updateQuery(qi, (data) => {
    return fn(result, data as any) as any;
  });
}

//cache lookup doesn't seem to work, its fetching all the time.
export const caccheExchangeConfig = {
  keys: {
    PaginatedBankActivity: () =>  null,
  },
  updates: {
    Mutation: {
      login: (_result, args, cache, info) => {
        updateCache<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.login.errors) {
              console.log("errorrs: ", query);
              return query;
            } else {
              let r = {
                me: {
                  user: result.login.user,
                  tokenInfo: result.login.tokenInfo,
                },
              };
              console.log("success: ", r);
              return r;
            }
          }
        );
      },
      register: (_result, args, cache, info) => {
        updateCache<RegisterMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.register.errors) {
              console.log("errorrs: ", query);
              return query;
            } else {
              let r = {
                me: {
                  user: result.register.user,
                  tokenInfo: result.register.tokenInfo,
                },
              };
              console.log("success: ", r);
              return r;
            }
          }
        );
      },
    },
  },
} as CacheExchangeOpts;

export const createUrqlClient = (ssrExchange: any) => ({
  url: __GRAPHQL_API_SERVER__,
  //requestPolicy:'network-only',
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange(caccheExchangeConfig),
    ssrExchange,
    fetchExchange,
  ],
});


export const UrqlClientConfig = () => {
  //const isServerSide = typeof window === "undefined";

  // The `ssrExchange` must be initialized with `isClient` and `initialState`
  const ssr = ssrExchange({
    isClient: !isServerSide(),
    initialState: !isServerSide() ? window.__URQL_DATA__ : undefined,
  });
  return {
    url: __GRAPHQL_API_SERVER__,
    //requestPolicy:'network-only',
    fetchOptions: {
      credentials: "include" as const,
    },
    exchanges: [
      devtoolsExchange,
      dedupExchange,
      cacheExchange(caccheExchangeConfig),
      ssr,
      fetchExchange,
    ],
  };
};
