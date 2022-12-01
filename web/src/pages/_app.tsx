import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { createClient, Provider } from 'urql';
import theme from '../theme';

import { AuthProvider } from '../app/AuthContext';
import * as urqlConfig from '../app/urql-bootstrap';
import * as shell from '../components/shell';
import { ChakraContainer } from '../components/storybook/ChakraContainer';

import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { Container } from 'typedi';
import { APP_CONFIG } from '../app/AppConfig';

export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppWithLayout = AppProps & {
  Component: PageWithLayout
}

function getDescendantProp(obj, desc) {
  var arr = desc.split(".");
  while(arr.length && (obj = obj[arr.shift()]));
  return obj;
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
  Container.set('AppConfig', APP_CONFIG);
  for ( const attr of APP_CONFIG.config ) {
    Container.set(attr.container_ref,getDescendantProp(APP_CONFIG,attr.prop));
  }

  const client = createClient(urqlConfig.UrqlClientConfig())

  // all pages get the UrqlClient & AuthContext provides
  return (
    <Provider value={client}>
      <AuthProvider>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </AuthProvider>
    </Provider>
  )
}

export default MyApp
