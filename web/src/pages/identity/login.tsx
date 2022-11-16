import { withUrqlClient } from 'next-urql';
import { ReactElement } from 'react';
import { createUrqlClient } from '../../app/urql-bootstrap';
import { SignIn } from '../../components/identity/SignIn';
import * as shell from '../../components/shell';


const Login = () => {
  return (
    <>
      <SignIn />
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



export default withUrqlClient(createUrqlClient, { ssr: false })(Login)