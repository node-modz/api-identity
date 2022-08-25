import { ChakraProvider, createLocalStorageManager } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { cacheExchange, Cache, QueryInput, query } from '@urql/exchange-graphcache';
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';

import * as urqlConfig from '../app/urql-bootstrap'
import { AuthProvider } from '../app/AuthContext';
import { __GRAPHQL_API_SERVER__ } from '../app/app-constants';




function MyApp({ Component, pageProps, router }: AppProps) {

  // const cacheEx = cacheExchange(urqlConfig.caccheExchangeConfig);
  // const client = createClient({
  //   url: __GRAPHQL_API_SERVER__,
  //   //requestPolicy:'network-only',
  //   fetchOptions: {
  //     credentials: "include",
  //   },
  //   exchanges: [devtoolsExchange, dedupExchange, cacheEx, fetchExchange],
  // });

  console.log("loading _app");
  return (
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
  )
}

export default MyApp
