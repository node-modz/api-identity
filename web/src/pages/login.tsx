import TopNavBar from '../components/TopNavBar';
import { SignIn } from '../components/SignIn';
import { AuthProvider } from '../app/AuthContext';

const Login = () => {
  return (
    <>
      <TopNavBar/>
      <SignIn/>
    </>
  );
}

export default Login