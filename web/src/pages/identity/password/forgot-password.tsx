import { ReactElement } from 'react';
import { ForgotPassword } from '../../../mfe/identity/components/ForgotPassword';
import * as shell from '../../../mfe/shell/components';

const ForgotPasswordPage = () => {
  return (
    <>
      <ForgotPassword />
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

export default ForgotPasswordPage;