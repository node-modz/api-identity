import TopNavBar from '../components/TopNavBar';
import { SignIn } from '../components/SignIn';
import { AuthProvider } from '../app/AuthContext';
import { createUrqlClient } from '../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';

const Login = () => {
  return (
    <>
      <TopNavBar/>
      <SignIn/>
    </>
  );
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Login)