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
import { useState } from 'react';

export const ForgotPassword = () => {
    const [, forgotPasswordAPI] = useForgotPasswordMutation()
    const router = useRouter();
    const [apiError, setAPIError] = useState("")
    return (
        <Formik
            initialValues={{ username: "", email: "" }}
            onSubmit={async (values, helpers) => {
                const { setErrors } = helpers     
                setAPIError("");
                const response = await forgotPasswordAPI(values)
                if (response.error) {
                    //TODO: have a standard toast to display these errors?
                    console.log(response.error)
                    setAPIError(response.error.toString())
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
                            <Heading fontSize={'3xl'}>Enter Your Email</Heading>                                
                            </Stack>
                            <Box
                                rounded={'lg'}
                                bg={useColorModeValue('white', 'gray.700')}
                                boxShadow={'lg'}
                                p={8}>
                                <Stack spacing={4}>
                                    <Form>
                                        <Box mr={2} style={{ color: "red" }}>
                                            {apiError}
                                        </Box>
                                        <InputField label="Email" placeholder='email' name='email' />
                                        <Stack spacing={10}>
                                            <Stack
                                                direction={{ base: 'column', sm: 'row' }}
                                                align={'start'}
                                                justify={'space-between'}>
                                                <NextLink href={MODULE_CONFIG.identity.login.href}>
                                                    <Link href={MODULE_CONFIG.identity.login.href}
                                                        ml={'auto'}
                                                        color={'blue.400'}>
                                                        Sign In?
                                                    </Link>
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
