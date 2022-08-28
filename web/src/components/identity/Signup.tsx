import { Form, Formik } from 'Formik';
import { useRouter } from "next/router";
import { useRegisterMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/utils';
import { InputField, PasswordField } from '../InputField';
import NextLink from 'next/link';
import {
  Flex,
  Box, HStack, Stack,
  Button,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { MODULE_CONFIG } from '../../app/ModuleConfig';
import { AuthContext } from '../../app/AuthContext';



export const Signup = () => {
  const authContext = useContext(AuthContext)
  const [registerReponse, register] = useRegisterMutation();
  const [errMsg, setErrorMsg] = useState('');
  const router = useRouter();
  return (
    <Formik
      initialValues={{ firstName: "", lastName: "", email: "", username: "", password: "" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await register(values);
        if (response.error) {
          console.log(response.error);
          setErrorMsg(response.error.toString())
        } else if (response.data?.register.errors) {
          setErrors(toErrorMap(response.data.register.errors));
        } else if (response.data?.register.tokenInfo) {          
          authContext.setAuthState?.(response.data?.register.tokenInfo)
          console.log("postsignup: isAuthenticated:",authContext.isAuthenticated?.())
          router.push(MODULE_CONFIG.identity.postSignup.href);
        }
      }}>
      {({ isSubmitting }) => {
        return (
          <Form>
            <Flex
              minH={'100vh'}
              align={'center'}
              justify={'center'}
              bg={useColorModeValue('gray.50', 'gray.800')}>
              <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                  <Heading fontSize={'4xl'} textAlign={'center'}>
                    Sign up
                  </Heading>
                </Stack>
                <Box
                  rounded={'lg'}
                  bg={useColorModeValue('white', 'gray.700')}
                  boxShadow={'lg'}
                  p={8}>
                  <Stack spacing={4}>
                    <HStack>
                      <Box>
                        <InputField label="First Name" placeholder='First Name' name='firstName' type="text" />
                      </Box>
                      <Box>
                        <InputField label="Last Name" placeholder='Last Name' name='lastName' type="text" />
                      </Box>
                    </HStack>
                    <InputField label="Email" placeholder='Email' name='username' type="text" />
                    <PasswordField label="Password" placeholder='password' name='password' type='password' />
                    <Stack spacing={10} pt={2}>
                      <Button
                        type='submit'
                        isLoading={isSubmitting}
                        loadingText="Submitting"
                        size="lg"
                        bg={'blue.400'}
                        color={'white'}
                        _hover={{
                          bg: 'blue.500',
                        }}>
                        Sign up
                      </Button>
                    </Stack>
                    {errMsg ? <div className='error'>{errMsg}</div> : <></>}
                    <Stack pt={6}>
                      <Text align={'center'}>
                        Already a user? <NextLink href="/login" as="/login"> Login </NextLink>
                      </Text>
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </Flex>
          </Form>);
      }}
    </Formik>
  );
};
