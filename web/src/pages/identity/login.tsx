import { ReactElement } from 'react';
import { SignIn } from '../../mfe/identity/components/SignIn';
import * as shell from '../../mfe/shell/components';


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

export default Login;