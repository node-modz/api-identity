import TopNavBar from '../components/TopNavBar';
import { Signup } from '../components/Signup';
import { AuthProvider } from '../app/AuthContext';
import { createUrqlClient } from '../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';

const Register = () => {
  return (
    <>
      <TopNavBar />
      <Signup />
    </>
  );
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Register)




