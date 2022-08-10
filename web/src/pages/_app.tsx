import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { cacheExchange, Cache, QueryInput, query } from '@urql/exchange-graphcache';
import { Provider, createClient, dedupExchange, fetchExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';

import * as urqlConfig from '../app/urql-bootstrap'




function MyApp({ Component, pageProps }: AppProps) {

  const cacheEx = cacheExchange(urqlConfig.caccheExchangeConfig);
  const client = createClient({
    url: 'http://localhost:4000/graphql',
    //requestPolicy:'network-only',
    fetchOptions: {
      credentials: "include",
    },
    exchanges: [devtoolsExchange, dedupExchange, cacheEx, fetchExchange],
  });

  return (
    <Provider value={client}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
