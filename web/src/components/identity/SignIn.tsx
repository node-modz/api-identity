import { useContext, useEffect, useState } from 'react';
import { Form, Formik } from 'Formik';
import { useRouter } from "next/router";
import { useLoginMutation } from '../../graphql/identity/graphql';
import { toErrorMap } from '../../utils/utils';
import { InputField } from '../core/InputField';
import {
  Flex,
  Box, Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  Divider,
  Center,
  useColorModeValue
} from '@chakra-ui/react';
import { APP_CONFIG } from '../../app/AppConfig';
import { AuthContext } from '../../app/AuthContext';
import NextLink from 'next/link'
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { SiLinkedin, SiMessenger } from 'react-icons/si';
import Container from 'typedi';
import { AuthService } from '../../lib/identity/services/AuthService';

export const SignIn = () => {
  const authContext = useContext(AuthContext)
  const [errMsg, setErrorMsg] = useState('');
  const [domLoaded, setDomLoaded] = useState(false);
  const [, loginRequest] = useLoginMutation();
  const router = useRouter();
  useEffect(() => {
    setDomLoaded(true)
  }, []);
  if (!domLoaded)
    return (<></>)
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await loginRequest(values);

        if (response.error) {
          console.log("error: ", response.error);
          setErrorMsg(response.error.message);
        } else if (response.data?.login.errors) {
          setErrors(toErrorMap(response.data.login.errors));
        } else {
          if (response.data?.login.tokenInfo) {
            authContext.setAuthState?.(response.data?.login.tokenInfo)
            console.log("postlogin: isAuthenticated:", authContext.isAuthenticated?.())
          }
          router.push(APP_CONFIG.identity.postLogin.href);
        }
      }}>
      {({ isSubmitting }) => {
        return (
          <Flex p={8}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={4} px={6}>
              <Stack align={'center'}>
                <Text fontSize={'2xl'}>Sign in with Social Accounts</Text>
              </Stack>
              <SocialLogin />
              <Divider />
              <Stack align={'center'}>
                <Text fontSize={'2xl'}> or Login </Text>
              </Stack>
              <Divider />
              <Box
                rounded={'lg'}
                bg={useColorModeValue('white', 'gray.700')}
                boxShadow={'lg'}
                p={8}>
                <Stack spacing={4}>
                  <Form>
                    <InputField label="Username/Email" placeholder='username' name='username' />
                    <InputField label="Password" placeholder='password' name='password' type='password' />
                    <Stack spacing={10}>
                      <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align={'start'}
                        justify={'space-between'}>
                        <Checkbox>Remember me</Checkbox>
                        <NextLink href={APP_CONFIG.identity.forgotPassword.href}>
                          <Link href={APP_CONFIG.identity.forgotPassword.href} color={'blue.400'}>Forgot password?</Link>
                        </NextLink>
                      </Stack>
                      {errMsg ? <div className='error'>{errMsg}</div> : <></>}
                      <Button
                        type='submit'
                        bg={'blue.400'}
                        color={'white'}
                        isLoading={isSubmitting}
                        _hover={{
                          bg: 'blue.500',
                        }}>
                        Sign in
                      </Button>
                    </Stack>
                  </Form>
                </Stack>
              </Box>
            </Stack>
          </Flex>
        );
      }}
    </Formik>
  );
};

const SocialLogin = () => {
  const authService = Container.get(AuthService);
  return (
    <Center p={1}>
      <Stack spacing={2} align={'center'} maxW={'md'} w={'full'}>
        {/* Facebook */}
        {/* <Button w={'full'} colorScheme={'facebook'} leftIcon={<FaFacebook />}>
          <Center>
            <Text>Sign in with Facebook</Text>
          </Center>
        </Button> */}

        {/* LinkedIn */}
        {/* <Button w={'full'} colorScheme={'messenger'} leftIcon={<SiLinkedin />}>
          <Center>
            <Text>Signin with Linkedin</Text>
          </Center>
        </Button> */}

        {/* Google */}

        <Button onClick={async () => {
          authService.login({ extraQueryParams: { idp: 'google' } })
        }} w={'full'} variant={'outline'} leftIcon={<FcGoogle />}>
          <Center>
            <Text>Sign in with Google</Text>
          </Center>
        </Button>

        {/* Github */}

        <Button onClick={async () => {
          authService.login({ extraQueryParams: { idp: 'github' } })
        }} w={'full'} colorScheme={'blackAlpha'} leftIcon={<FaGithub />}>
          <Center>
            <Text>Sign in with Github</Text>
          </Center>
        </Button>

      </Stack>
    </Center>
  );
}
