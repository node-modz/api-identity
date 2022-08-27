import { Form, Formik } from 'Formik';
import { useRouter } from "next/router";
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
import { MODULE_CONFIG } from '../../app/ModuleConfig';
import { AuthContext } from '../../app/AuthContext';
import NextLink from 'next/link'
import { useForgotPasswordMutation } from '../../generated/graphql';

export const ForgotPassword = () => {
  const [, forgotPasswordAPI] = useForgotPasswordMutation()
    const router = useRouter();
    return (
        <Formik
            initialValues={{ username:"", email: "" }}
            onSubmit={async (values, helpers) => {
                const { setErrors } = helpers
                const response = await forgotPasswordAPI(values)
                if (response.error) {
                    //TODO: have a standard toast to display these errors?
                    console.log(response.error)
                } else if (response.data) {
                    const { errors } = response.data.forgotPassword
                    if (errors) {
                        setErrors(toErrorMap(errors))
                    } else {
                        // TODO: show message to check email.
                    }
                }
            }}>
            {({ isSubmitting }) => {
                return (
                    <Flex
                        minH={'100vh'}
                        align={'center'}
                        justify={'center'}
                        bg={useColorModeValue('gray.50', 'gray.800')}>
                        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={4} px={6}>
                            <Stack align={'center'}>                                
                                <Text fontSize={'lg'} color={'gray.600'}>
                                    Enter Your Email
                                </Text>
                            </Stack>
                            <Box
                                rounded={'lg'}
                                bg={useColorModeValue('white', 'gray.700')}
                                boxShadow={'lg'}
                                p={8}>
                                <Stack spacing={4}>
                                    <Form>
                                        <InputField label="Email" placeholder='email' name='email' />                                        
                                        <Stack spacing={10}>
                                            <Stack
                                                direction={{ base: 'column', sm: 'row' }}
                                                align={'start'}
                                                justify={'space-between'}>
                                                <NextLink href={MODULE_CONFIG.identity.login.href}>
                                                    <Link href={MODULE_CONFIG.identity.login.href} ml={'auto'} color={'blue.400'}>Sign In?</Link>
                                                </NextLink>
                                            </Stack>
                                            <Button
                                                type='submit'
                                                bg={'blue.400'}
                                                color={'white'}
                                                isLoading={isSubmitting}
                                                _hover={{
                                                    bg: 'blue.500',
                                                }}>
                                                Get Link
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
