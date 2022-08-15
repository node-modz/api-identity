
import { Container } from '../components/Container'
import { Wrapper } from '../components/Wrapper'
import { Hero } from '../components/Hero';
import { DarkModeSwitch } from '../components/DarkModeSwitch';
import { Footer } from '../components/Footer';
import { NavBar } from '../components/NavBar';
import {
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import TopNavBar from '../components/neol/TopNavBar';
import { SignIn } from '../components/neol/SignIn';

const Login = () => {
  return (
    <>     
      <TopNavBar/>
      <SignIn/>
    </>
  );
}

export default Login