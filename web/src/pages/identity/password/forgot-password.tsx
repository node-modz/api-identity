import { ReactElement } from 'react';
import { ForgotPassword } from '../../../components/identity/ForgotPassword';
import * as shell from '../../../components/shell';

const ForgotPasswordPage = () => {
    return (
        <>
          <ForgotPassword/>
        </> 
      );
}

ForgotPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <shell.TopNavBar />
      {page}
    </>
  )
}

export default ForgotPassword;