
import {
    Avatar,
    Badge,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Link,
    Stack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Tfoot,
    Th,
    Thead,
    Tr,
    useColorModeValue,
} from '@chakra-ui/react';

export default function Card() {
    return (
        <Center py={6} w={{sm:'1xs', md:'1xs'}}>
            <Stack
                borderWidth="1px"
                borderRadius="lg"
                w={{ sm: '100%', md: '1xs' }}
                height={{ sm: '476px', md: '20rem' }}
                direction={{ base: 'column', md: 'row' }}
                bg={useColorModeValue('white', 'gray.900')}
                boxShadow={'2xl'}
                padding={4}>
                
                <Flex justify={'center'} mt={-12}>
                    <Avatar
                        size={'xl'}
                        src={
                            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ'
                        }                        
                        css={{
                            border: '2px solid white',
                        }}
                    />
                </Flex>
                <Stack
                    flex={1}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    p={1}
                    pt={2}>
                    <Heading fontSize={'2xl'} fontFamily={'body'}>
                        Lindsey James
                    </Heading>
                    <Text fontWeight={600} color={'gray.500'} size="sm" mb={4}>
                        @lindsey_jam3s
                    </Text>



                    <Stack
                        width={'100%'}
                        mt={'2rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            bg={'blue.400'}
                            color={'white'}
                            boxShadow={
                                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                            }
                            _hover={{
                                bg: 'blue.500',
                            }}
                            _focus={{
                                bg: 'blue.500',
                            }}>
                            Loan
                        </Button>
                        <Button
                            flex={1}
                            fontSize={'sm'}
                            rounded={'full'}
                            bg={'blue.400'}
                            color={'white'}
                            boxShadow={
                                '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                            }
                            _hover={{
                                bg: 'blue.500',
                            }}
                            _focus={{
                                bg: 'blue.500',
                            }}>
                            Pay
                        </Button>
                    </Stack>
                    <Stack
                        width={'100%'}
                        mt={'2rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}>
                        <Stack direction={'column'}>
                            <TableContainer width={'100%'}>
                                <Table size='sm'>
                                    <Thead>
                                        <Tr>
                                            <Th>Asset</Th>
                                            <Th>Liability</Th>
                                            <Th>Net</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td><Text fontWeight={800} fontSize={'sm'}>
                                                $50
                                            </Text></Td>
                                            <Td><Text color={'red.200'} fontWeight={800} fontSize={'sm'}>
                                                -$200
                                            </Text></Td>
                                            <Td><Text color={'red.200'} fontWeight={800} fontSize={'sm'}>
                                                -$150
                                            </Text></Td>
                                        </Tr>
                                    </Tbody>
                                    <Thead>
                                        <Tr>
                                            <Th>Income</Th>
                                            <Th>Expense</Th>
                                            <Th>Net</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td><Text fontWeight={800} fontSize={'sm'}>
                                                $1000
                                            </Text></Td>
                                            <Td><Text fontWeight={800} fontSize={'sm'}>
                                                $200
                                            </Text></Td>
                                            <Td><Text fontWeight={800} fontSize={'sm'}>
                                                $800
                                            </Text></Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

        </Center>
    );
}