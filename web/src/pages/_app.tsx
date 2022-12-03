import { ChakraProvider } from '@chakra-ui/react';
import { AppProps } from 'next/app';
import { createClient, Provider } from 'urql';
import theme from '../theme';

import { AuthProvider } from '../mfe/identity/components/AuthContext';
import * as urqlConfig from '../mfe/identity/graphql/Urql';
import * as shell from '../mfe/shell/components';
import { ChakraContainer } from '../mfe/storybook/components/ChakraContainer';

import type { NextPage } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { Container } from 'typedi';
import { __APP_CONFIG__ } from '../app-config';

export type PageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppWithLayout = AppProps & {
  Component: PageWithLayout
}

function getDescendantProp(obj: any, desc: string) {
  var arr: string[] = desc.split(".");
  while (arr.length && obj) {
    let prop = arr.shift();
    if (prop) {
      obj = obj[prop];
    }
  }
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
  Container.set('AppConfig', __APP_CONFIG__);
  for (const attr of __APP_CONFIG__.config) {
    Container.set(
      attr.container_ref,
      getDescendantProp(__APP_CONFIG__, attr.prop)
    );
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
