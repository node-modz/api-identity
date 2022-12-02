import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext'
import { Stack, Text, Button } from '@chakra-ui/react'

const AuthStateItem = ({ title, value='' }: { title: string, value: string }) => {
    return (
        <>
            <Text>{title}</Text>
            <Text>{value}</Text>
        </>
    )
}
const AuthInfo = () => {
    const authContext = useContext(AuthContext);
    if ( authContext.authState ) {
        const {token,userInfo,expiresAt} = authContext.authState
        return (
            <Stack>
                <AuthStateItem title='token' value={token}></AuthStateItem>
                <AuthStateItem title='token:decoded' value={token ? Buffer.from(token.split(".")[1],'base64').toString('ascii') : ""}></AuthStateItem>
                <AuthStateItem title='userInfo' value={JSON.stringify(userInfo)}></AuthStateItem>
                <AuthStateItem title='expiresAt' value={expiresAt ? (new Date(expiresAt*1000)).toString() : ""}></AuthStateItem>
            </Stack>
        )
    }
    return <></>
}

const AuthContent = () => {
    const [showAuthDebugger, setShowAuthDebugger] = useState(false);
    return (
        <footer className="p-6">
            <div className="ml-2">                
                <Button colorScheme='blue' onClick={() =>
                    setShowAuthDebugger(!showAuthDebugger)
                }>
                    AuthInfo
                </Button>
            </div>
            <div className="mt-4">
                {showAuthDebugger && <AuthInfo />}
            </div>
        </footer>
    );
};

export { AuthContent }
