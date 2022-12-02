import { ReactElement } from 'react';
import { Signup } from '../../mfe/identity/components/Signup';
import * as shell from '../../mfe/shell/components';

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


