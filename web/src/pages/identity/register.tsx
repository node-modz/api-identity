import * as shell from '../../components/shell';
import { Signup } from '../../components/identity/Signup';
import { AuthProvider } from '../../app/AuthContext';
import { createUrqlClient } from '../../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';
import { ReactElement } from 'react';

const Register = () => {
  return (
    <>
      <Signup />
    </>
  );
}

Register.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <shell.TopNavBar />
      {page}
    </>
  )
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Register)




