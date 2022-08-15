import { Form, Formik } from 'Formik';
import { useRouter } from "next/router";
import { useLoginMutation } from '../../generated/graphql';
import { toErrorMap } from '../../utils/utils';
import { InputField } from '../InputField';
import {
  Flex,
  Box, Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue
} from '@chakra-ui/react';

export const SignIn = () => {
  const [, loginRequest] = useLoginMutation();
  const router = useRouter();
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await loginRequest(values);
        console.log(response.operation.context);
        if (response.data?.login.errors) {
          setErrors(toErrorMap(response.data.login.errors));
        } else {
          router.push("/");
        }
      }}>
      {(props) => {
        const { values, errors, touched, handleChange, isSubmitting } = props;
        return (
          <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={4} px={6}>
              <Stack align={'center'}>
                <Heading fontSize={'4xl'}>Sign in to your account</Heading>
                <Text fontSize={'lg'} color={'gray.600'}>
                  to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
                </Text>
              </Stack>
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
                        <Link color={'blue.400'}>Forgot password?</Link>
                      </Stack>
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
