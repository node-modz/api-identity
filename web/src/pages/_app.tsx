import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { Provider, createClient } from 'urql';

import * as urqlConfig from '../app/urql-bootstrap'
import { AuthProvider } from '../app/AuthContext';
import { __GRAPHQL_API_SERVER__ } from '../app/app-constants';




function MyApp({ Component, pageProps, router }: AppProps) {

  const client = createClient(urqlConfig.UrqlClientConfig())
  console.log("loading _app");

  return (
    <Provider value={client}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  )
}

export default MyApp
