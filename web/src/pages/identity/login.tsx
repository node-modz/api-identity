import * as shell from '../../components/shell';
import { SignIn } from '../../components/identity/SignIn';
import { AuthProvider } from '../../app/AuthContext';
import { createUrqlClient } from '../../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';
import { ReactElement } from 'react';

const Login = () => {
  return (
    <>
      <SignIn/>
    </>
  );
}

Login.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <shell.TopNavBar />
      {page}
    </>
  )
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Login)