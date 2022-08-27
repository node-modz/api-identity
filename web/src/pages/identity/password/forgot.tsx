import { createUrqlClient } from '../../../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';
import TopNavBar from '../../../components/TopNavBar';
import { ForgotPassword } from '../../../components/identity/ForgotPassword';

const ForgotPasswordPage = () => {
    return (
        <>
          <TopNavBar/>
          <ForgotPassword/>
        </> 
      );
}

export default withUrqlClient(createUrqlClient, { ssr: false })(ForgotPasswordPage);