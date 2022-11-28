import { ReactElement } from 'react';
import { Signup } from '../../components/identity/Signup';
import * as shell from '../../components/shell';

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

export default Register;


