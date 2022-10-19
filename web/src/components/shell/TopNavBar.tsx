import {
    Box,
    Flex,
    Text,
    IconButton,
    Button,
    Stack,
    Collapse,
    Icon,
    Link,
    Popover,
    PopoverTrigger,
    PopoverContent,
    useColorModeValue,
    useBreakpointValue,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    Avatar,
} from '@chakra-ui/react';
import {
    HamburgerIcon,
    CloseIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    AddIcon,
} from '@chakra-ui/icons';
import NextLink from 'next/link'
import { NextRouter, Router, useRouter } from "next/router"
import { useLogoutMutation, useMeQuery } from "../../graphql/identity/graphql"
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../app/AuthContext';
import { APP_CONFIG, NavItem } from '../../app/AppConfig';
import { AuthContent } from '../identity/AuthInfo';

export function TopNavBar() {
    const { isOpen, onToggle } = useDisclosure();
    return (
        <Box>
            <Flex
                bg={useColorModeValue('white', 'gray.800')}
                color={useColorModeValue('gray.600', 'white')}
                minH={'60px'}
                py={{ base: 2 }}
                px={{ base: 4 }}
                borderBottom={1}
                borderStyle={'solid'}
                borderColor={useColorModeValue('gray.200', 'gray.900')}
                align={'center'}>
                <Flex
                    flex={{ base: 1, md: 'auto' }}
                    ml={{ base: -2 }}
                    display={{ base: 'flex', md: 'none' }}>
                    <IconButton
                        onClick={onToggle}
                        icon={
                            isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                        }
                        variant={'ghost'}
                        aria-label={'Toggle Navigation'}
                    />
                </Flex>
                <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
                    <Text
                        textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
                        fontFamily={'heading'}
                        color={useColorModeValue('gray.800', 'white')}>
                        Logo
                    </Text>

                    <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
                        <DesktopNav />
                    </Flex>
                </Flex>

                <Stack
                    flex={{ base: 1, md: 0 }}
                    justify={'flex-end'}
                    direction={'row'}
                    spacing={6}>
                    <LoggedInState />
                </Stack>
            </Flex>

            <Collapse in={isOpen} animateOpacity>
                <MobileNav />
            </Collapse>
        </Box>
    );
}

const LoggedInState = () => {
    const [domLoaded, setDomLoaded] = useState(false);
    const router = useRouter();
    const [response, logoutAPI] = useLogoutMutation();
    const authContext = useContext(AuthContext)

    useEffect(() => {
        setDomLoaded(true);
    }, []);

    if (!domLoaded) {
        return <></>
    }

    // TODO: is it possible to assign this as action in MODULE_CONFIG
    const doLogut = async () => {
        console.log("clicked logout")
        await logoutAPI({});
        authContext.logout?.();
        router.push(APP_CONFIG.identity.postLogout.href);
    }
    console.log("In LoggedInState: isAuthenticated", authContext.isAuthenticated?.())

    let view = null;
    if (authContext.isAuthenticated?.()) {
        view = (
            <>                
                <UserProfile />
                <Button onClick={async () => {
                    doLogut();
                }} variant="link" mr={12}>logout
                </Button>
            </>
        )
    } else {
        view = (
            <>
                <Login />
                <Register />
            </>
        )
    }
    //const [{ data, fetching }] = useMeQuery();
    // if (!fetching && !data?.me) {
    //     view = (
    //         <>
    //             <Login />
    //             <Register />
    //         </>
    //     )
    // } else if (!fetching && data?.me) {           
    //     view = (
    //         <>
    //             <UserProfile />
    //             <Button onClick={() => { 
    //                 doLogut();
    //             }} variant="link" mr={12}>logout
    //             </Button>
    //         </>
    //     )
    // }
    return (<>{view}</>);


}
const Login = () => {
    return (
        <NextLink href={APP_CONFIG.identity.login.href}>
            <Button
                as={'a'}
                fontSize={'sm'}
                fontWeight={400}
                variant={'link'}>
                Sign In
            </Button>
        </NextLink>
    )
}
const Register = () => {
    return (
        <NextLink href={APP_CONFIG.identity.register.href}>
            <Button
                as={'a'}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'pink.400'}
                _hover={{
                    bg: 'pink.300',
                }}>
                Sign Up
            </Button>
        </NextLink>
    )
}
const UserProfile = () => {
    return (
        <Menu>
            <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                    size={'sm'}
                    src={
                        'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                />
            </MenuButton>
            <MenuList>
                //TODO: onClick of logout call logout function above
                {APP_CONFIG.UserProfile.Items.map((navItem) => {
                    if (navItem.href) {
                        return (
                            <NextLink key={navItem.label} href={navItem.href}>
                                <MenuItem>{navItem.label}</MenuItem>
                            </NextLink>
                        )
                    } else {
                        return (<MenuDivider key={navItem.label} />)
                    }
                })}
            </MenuList>
        </Menu>
    )
}
const DesktopNav = () => {
    const linkColor = useColorModeValue('gray.600', 'gray.200');
    const linkHoverColor = useColorModeValue('gray.800', 'white');
    const popoverContentBgColor = useColorModeValue('white', 'gray.800');

    return (
        <Stack direction={'row'} spacing={4}>
            {APP_CONFIG.TopNav.Items.map((navItem) => (
                <Box key={navItem.label}>
                    <Popover trigger={'hover'} placement={'bottom-start'}>
                        <PopoverTrigger>
                            <Link
                                p={2}
                                href={navItem.href ?? '#'}
                                fontSize={'sm'}
                                fontWeight={500}
                                color={linkColor}
                                _hover={{
                                    textDecoration: 'none',
                                    color: linkHoverColor,
                                }}>
                                {navItem.label}
                            </Link>
                        </PopoverTrigger>

                        {navItem.children && (
                            <PopoverContent
                                border={0}
                                boxShadow={'xl'}
                                bg={popoverContentBgColor}
                                p={4}
                                rounded={'xl'}
                                minW={'sm'}>
                                <Stack>
                                    {navItem.children.map((child) => (
                                        <DesktopSubNav key={child.label} {...child} />
                                    ))}
                                </Stack>
                            </PopoverContent>
                        )}
                    </Popover>
                </Box>
            ))}
        </Stack>
    );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
    return (
        <Link
            href={href}
            role={'group'}
            display={'block'}
            p={2}
            rounded={'md'}
            _hover={{ bg: useColorModeValue('pink.50', 'gray.900') }}>
            <Stack direction={'row'} align={'center'}>
                <Box>
                    <Text
                        transition={'all .3s ease'}
                        _groupHover={{ color: 'pink.400' }}
                        fontWeight={500}>
                        {label}
                    </Text>
                    <Text fontSize={'sm'}>{subLabel}</Text>
                </Box>
                <Flex
                    transition={'all .3s ease'}
                    transform={'translateX(-10px)'}
                    opacity={0}
                    _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
                    justify={'flex-end'}
                    align={'center'}
                    flex={1}>
                    <Icon color={'pink.400'} w={5} h={5} as={ChevronRightIcon} />
                </Flex>
            </Stack>
        </Link>
    );
};

const MobileNav = () => {
    return (
        <Stack
            bg={useColorModeValue('white', 'gray.800')}
            p={4}
            display={{ md: 'none' }}>
            {APP_CONFIG.TopNav.Items.map((navItem) => (
                <MobileNavItem key={navItem.label} {...navItem} />
            ))}
        </Stack>
    );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
    const { isOpen, onToggle } = useDisclosure();

    return (
        <Stack spacing={4} onClick={children && onToggle}>
            <Flex
                py={2}
                as={Link}
                href={href ?? '#'}
                justify={'space-between'}
                align={'center'}
                _hover={{
                    textDecoration: 'none',
                }}>
                <Text
                    fontWeight={600}
                    color={useColorModeValue('gray.600', 'gray.200')}>
                    {label}
                </Text>
                {children && (
                    <Icon
                        as={ChevronDownIcon}
                        transition={'all .25s ease-in-out'}
                        transform={isOpen ? 'rotate(180deg)' : ''}
                        w={6}
                        h={6}
                    />
                )}
            </Flex>

            <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
                <Stack
                    mt={2}
                    pl={4}
                    borderLeft={1}
                    borderStyle={'solid'}
                    borderColor={useColorModeValue('gray.200', 'gray.700')}
                    align={'start'}>
                    {children &&
                        children.map((child) => (
                            <Link key={child.label} py={2} href={child.href}>
                                {child.label}
                            </Link>
                        ))}
                </Stack>
            </Collapse>
        </Stack>
    );
};

