import { ReactElement } from 'react';
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

export default Login;