import * as shell from '../../components/shell';
import { Signup } from '../../components/identity/Signup';
import { AuthProvider } from '../../app/AuthContext';
import { createUrqlClient } from '../../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';

const Register = () => {
  return (
    <>
      <shell.TopNavBar />
      <Signup />
    </>
  );
}

export default withUrqlClient(createUrqlClient,{ssr:false})(Register)




