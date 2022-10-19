import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { Provider, createClient } from 'urql';

import * as urqlConfig from '../app/urql-bootstrap'
import { AuthProvider } from '../app/AuthContext';
import { __GRAPHQL_API_SERVER__ } from '../app/app-constants';
import * as shell from '../components/shell'
import { ChakraContainer } from '../components/sample/ChakraContainer'

import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'

export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppWithLayout = AppProps & {
  Component: PageWithLayout
}


function MyApp({ Component, pageProps, router }: AppWithLayout) {

  const getLayout = Component.getLayout ?? ((page) => {
    // default layout if nothing is specified on the component
    return (
      <>
        <shell.TopNavBar />
        <shell.SimpleSidebar>
          {/* the actual page */}
          {page}
          {/* displays chakra info */}
          <ChakraContainer />
        </shell.SimpleSidebar>
      </>
    )
  })

  const client = createClient(urqlConfig.UrqlClientConfig())
  console.log("loading _app");

  // all pages get the UrqlClient & AuthContext provides
  return (
    <Provider value={client}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
        { getLayout(<Component {...pageProps} />) }
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  )
}

export default MyApp
