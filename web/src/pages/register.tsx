import { useFormikContext, useField, FieldInputProps, Field } from 'Formik'
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
  InputGroup,
  InputRightElement,
  Link,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import TopNavBar from '../components/neol/TopNavBar';
import { Signup } from '../components/neol/Signup';

const Register = () => {
  return (
    <>     
      <TopNavBar />
      <Signup />
    </>
  );
}

export default Register




