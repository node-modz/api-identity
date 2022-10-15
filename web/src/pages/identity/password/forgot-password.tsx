import { createUrqlClient } from '../../../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';
import * as shell from '../../../components/shell';

import { ForgotPassword } from '../../../components/identity/ForgotPassword';

const ForgotPasswordPage = () => {
    return (
        <>
          <shell.TopNavBar/>
          <ForgotPassword/>
        </> 
      );
}


export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPasswordPage);