import { createUrqlClient } from '../../../app/urql-bootstrap';
import { withUrqlClient } from 'next-urql';
import { NextPage } from 'next';
import { Form, Formik } from 'Formik';
import { useRouter } from "next/router";
import { toErrorMap } from '../../../utils/utils';
import { InputField, PasswordField } from '../../../components/core/InputField'
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
import { MODULE_CONFIG } from '../../../app/ModuleConfig';
import { AuthContext } from '../../../app/AuthContext';
import NextLink from 'next/link'
import { useChangePasswordMutation } from '../../../graphql/identity/graphql';

import * as shell from '../../../components/shell'
import { useContext, useState } from 'react';

const ChangePasswordPage: NextPage<{ token: string }> = ({ token }) => {
    return (
        <>
            <shell.TopNavBar />
            <ChangePassword />
        </>
    );
}

ChangePasswordPage.getInitialProps = ({ query }) => {
    return {
        token: query.token as string
    }
}



const ChangePassword = () => {
    const [, changePasswordAPI] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState("");
    const [apiError, setAPIError] = useState("");
    const router = useRouter();
    const authContext = useContext(AuthContext)

    console.log("token:", router.query.token)
    return (
        <Formik
            initialValues={{ password: "" }}
            onSubmit={async (values, helpers) => {
                const { setErrors } = helpers
                const response = await changePasswordAPI({
                    token: typeof router.query.token === "string"
                        ? router.query.token
                        : "",
                    ...values
                })
                if (response.error) {
                    //TODO: have a standard toast to display these errors?
                    console.log(response.error)
                    setAPIError(response.error.toString());
                } else if (response.data) {
                    const { errors } = response.data.changePassword
                    if (errors) {
                        const errorMap = toErrorMap(errors)
                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap)
                    } else {
                        if (response.data?.changePassword.tokenInfo) {
                            authContext.setAuthState?.(response.data?.changePassword.tokenInfo)
                            console.log("postlogin: isAuthenticated:", authContext.isAuthenticated?.())
                        }
                        router.push(MODULE_CONFIG.identity.postLogin.href);
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
                        <Stack mt={20} spacing={8} mx={'auto'} maxW={'lg'} py={4} px={6}>
                            <Stack align={'center'}>
                            <Heading fontSize={'3xl'}>Change Password</Heading>
                            </Stack>
                            <Box
                                rounded={'lg'}
                                bg={useColorModeValue('white', 'gray.700')}
                                boxShadow={'lg'}
                                p={8}>
                                <Stack spacing={4}>
                                    <Form>                                        
                                        <PasswordField label="Password" placeholder='password' name='password' type='password' />
                                        <Box mt={2} mr={2} style={{ color: "red" }}>
                                            {tokenError}
                                        </Box>
                                        <Box mt={2} mr={2} style={{ color: "red" }}>
                                            {apiError}
                                        </Box>
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
                                                Reset Password
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


export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePasswordPage)