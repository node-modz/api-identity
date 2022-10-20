import {
  makeOperation, Operation
} from '@urql/core';
import { devtoolsExchange } from "@urql/devtools";
import { authExchange } from '@urql/exchange-auth';
import {
  Cache, cacheExchange, CacheExchangeOpts, QueryInput
} from "@urql/exchange-graphcache";
import { dedupExchange, errorExchange, fetchExchange, ssrExchange } from "urql";
import {
  LoginMutation,
  MeDocument,
  MeQuery,
  RegisterMutation
} from "../graphql/identity/graphql";
import { isServerSide } from "../utils/utils";
import { __GRAPHQL_API_SERVER__ } from "./app-constants";


declare global {
  interface Window {
    __URQL_DATA__: any
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
    PaginatedBankActivity: () => null,
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



type AuthState = {
  token: string
};

const urqlErrorExchange = () => {
  return errorExchange({
    onError: (error) => {
      // we only get an auth error here when the auth exchange had attempted to refresh auth and getting an auth error again for the second time
      const isAuthError = error.graphQLErrors.some(
        e => e.extensions?.code === 'UNAUTHENTICATED',
      );

      if (isAuthError) {
        // console.log("received Auth Error")        
        // appHistory.push("/identity/login");
        // appHistory.push("/identity/login");
        // not a real good option ideally the above appHistory.push() should have worked
        //window.location.href = "http://localhost:3000/identity/login"
        // refer: src/graphql/GraphQLAuth.ts
      }
    }
  })
}
const urqlAuthConfig = () => {
  return authExchange<AuthState>({
    // adds authorization header to outgoing requests
    addAuthToOperation: ({ authState, operation }) => {
      console.log("adding authorization ", authState?.token)
      if (!authState || !authState.token) {
        return operation;
      }

      const fetchOptions =
        typeof operation.context.fetchOptions === 'function'
          ? operation.context.fetchOptions()
          : operation.context.fetchOptions || {};

      const op: Operation = makeOperation(
        operation.kind,
        operation, {
        ...operation.context,
        fetchOptions: {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            Authorization: authState.token,
          },
        },
      });
      return op;
    },
    getAuth: async ({ authState }) => {
      if (isServerSide()){
        return null;
      }

      if (!authState) {        
        // urql cache doesn't have it, lets return what exists in localStorate.
        const token = typeof window !== 'undefined' ? localStorage.getItem("ldgr.token") : null;                
        if (token) {
          return { token };
        }
        return null;
      }
      // authState.token exists, gets called when there is an error
      // opportunity to refresh token here.
      console.log("urql -> getAuth: ", null)
      return null;
    },
    didAuthError: ({ error }) => {
      return error.graphQLErrors.some(e => e.extensions?.code === 'UNAUTHENTICATED');
    },
    willAuthError: ({ authState }) => {
      // for now let the backend API respond with appropriate error.
      // || /* JWT is expired */
      // if (!authState) return true;
      return false;
    },
  });
}

// TODO: merge UrqlClientConfig & createUrqlClient
export const UrqlClientConfig = () => {  

  // The `ssrExchange` must be initialized with `isClient` and `initialState`
  const ssr = ssrExchange({
    isClient: !isServerSide(),
    initialState: !isServerSide() ? window.__URQL_DATA__ : undefined,
  });
  return {
    url: __GRAPHQL_API_SERVER__,
    fetchOptions: {
      credentials: "include" as const,
    },
    exchanges: [
      devtoolsExchange,
      dedupExchange,    
      urqlErrorExchange(),
      urqlAuthConfig(),
      ssr,
      fetchExchange,
    ],
  };
};

export const createUrqlClient = (ssrExchange: any) => ({
  url: __GRAPHQL_API_SERVER__,
  fetchOptions: {
    credentials: "include" as const,
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange(caccheExchangeConfig),
    urqlErrorExchange(),
    urqlAuthConfig(),
    ssrExchange,
    fetchExchange,
  ],
});
