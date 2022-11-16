import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { createClient, Provider } from 'urql';
import theme from '../theme';

import { AuthProvider } from '../app/AuthContext';
import * as urqlConfig from '../app/urql-bootstrap';
import { ChakraContainer } from '../components/sample/ChakraContainer';
import * as shell from '../components/shell';

import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';

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
  console.log("loading _app");

  const client = createClient(urqlConfig.UrqlClientConfig())  
  
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
