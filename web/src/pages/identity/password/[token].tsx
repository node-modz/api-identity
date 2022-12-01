import {
    Box, Button, Flex, Heading, Link, Stack, useColorModeValue
} from '@chakra-ui/react';
import { Form, Formik } from 'Formik';
import NextLink from 'next/link';
import { useRouter } from "next/router";
import { AuthContext } from '../../../app/AuthContext';
import { PasswordField } from '../../../components/core/InputField';
import { useChangePasswordMutation } from '../../../graphql/identity/graphql';
import { toErrorMap } from '../../../utils/utils';

import { ReactElement, useContext, useState } from 'react';
import * as shell from '../../../components/shell';
import Container from 'typedi';
import { IdentityConfigOptions } from '../../../lib/identity/IdentityConfigOptions';

const ChangePasswordPage = () => {
    return (
        <>
            <ChangePassword />
        </>
    );
}

ChangePasswordPage.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <shell.TopNavBar />
            {page}
        </>
    )
}


const ChangePassword = () => {
    const [, changePasswordAPI] = useChangePasswordMutation()
    const [tokenError, setTokenError] = useState("");
    const [apiError, setAPIError] = useState("");
    const router = useRouter();
    const authContext = useContext(AuthContext);
    const identityConfig:IdentityConfigOptions = Container.get('IdentityConfigOptions');

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
                        router.push(identityConfig.links["postLogin"].href);
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
                                                <NextLink href={identityConfig.links["login"].href}>
                                                    <Link href={identityConfig.links["login"].href}
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

export default ChangePasswordPage;