import * as shell from '../../components/shell';
import { SignIn } from '../../components/identity/SignIn';
import { AuthProvider } from '../../app/AuthContext';
import { createUrqlClient } from '../../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';

const Login = () => {
  return (
    <>
      <shell.TopNavBar/>
      <SignIn/>
    </>
  );
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Login)