import { Box, Link, Flex, Button } from "@chakra-ui/react"
import NextLink from 'next/link'
import { Router, useRouter } from "next/router"
import React from "react"
import { useLogoutMutation, useMeQuery } from "../../graphql/identity/graphql"


interface NavBarProps { }

export const NavBar: React.FC<NavBarProps> = (props) => {
    const router = useRouter()
    const [response, logout] = useLogoutMutation()
    const [{ data, fetching }] = useMeQuery()
    let body = null;
    if (!fetching && !data?.me) {
        //user does not exist
        body = (
            <>
                <NextLink href="/login">
                    <Link color="white" mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white" mr={12}>register</Link>
                </NextLink>
            </>
        )
    } else if (!fetching && data?.me) {
        //user exists
        body = (
            <Flex>
                 <NextLink href="/login">
                    <Link color="white" mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link color="white" mr={12}>register</Link>
                </NextLink>
                <Box mr={4}><div>{data.me?.user?.username}</div></Box>
                <Button onClick={async () => {
                    console.log("clicked logout")
                    await logout({});
                    router.reload();
                }} variant="link" mr={12}>logout</Button>
            </Flex>
        )
    }
    return (
        <Flex bg="green.500" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    )
}