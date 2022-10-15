import { Box, Button, Flex, Heading, HStack, Link, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Tfoot, Th, Thead, Tr } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useState } from "react";
import CurrencyFormat from 'react-currency-format';


import { useBankActivityQuery } from "../../graphql/accounting/graphql";
import { createUrqlClient } from '../../app/urql-bootstrap'
import { format } from "date-fns";


export default function BankActivity() {
    const [variables, setVariables] = useState({ 'offset': 0, 'limit': 50 })
    const [{ data, error, fetching }] = useBankActivityQuery({
        variables: variables
    });

    if (!fetching && !data) {
        return (
            <div>
                <div>No data found</div>
                <div>{error?.message}</div>
            </div>
        );
    }

    return (
        <>
            <TableContainer>
                <Table size={'sm'} variant='striped' colorScheme='teal'>
                    <TableCaption>Bank Activity</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Date</Th>
                            <Th>description</Th>
                            <Th>activityType</Th>
                            <Th isNumeric>amount</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data && data!.bankActivity.activity.map((p) =>
                            !p ? null : (
                                <Tr key={p.id}>
                                    <Td>{format(new Date(p.activityDate), "yyyy-MM-dd")}</Td>
                                    <Td>{p.description}</Td>
                                    <Td textAlign={'right'}>{p.activityType}</Td>
                                    <Td isNumeric color={p.activityType === 'bank.deposit' ? '' : 'red.200'}>
                                        <CurrencyFormat decimalScale={2} displayType={'text'}
                                            value={(p.amount).toLocaleString(
                                                undefined, // leave undefined to use the visitor's browser 
                                                // locale or a string like 'en-US' to override it.
                                                { minimumFractionDigits: 2 }
                                            )}
                                            thousandSeparator={true}></CurrencyFormat>
                                    </Td>
                                    <Td color={p.activityType === 'bank.deposit' ? '' : 'red.200'}>
                                        {p.activityType === 'bank.deposit' ? '(+)' : '(-)'}
                                    </Td>
                                </Tr>
                            )
                        )}
                    </Tbody>
                    <Tfoot>
                        <Tr>
                            <Th>Date</Th>
                            <Th>description</Th>
                            <Th >activityType</Th>
                            <Th isNumeric>amount</Th>
                        </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>
            <HStack ml='auto'>
                {data ? (
                    <Flex>
                        <Button
                            onClick={() => {
                                let activity = data.bankActivity.activity
                                let offset = variables.offset - activity.length
                                setVariables({
                                    offset: offset > 0 ? offset : 0,
                                    limit: variables.limit,
                                })
                            }}
                            disabled={variables.offset <= 0}
                            my={8}
                        >
                            {"< prev:" + variables.offset}
                        </Button>
                        <Button
                            onClick={() => {
                                let activity = data.bankActivity.activity
                                setVariables({
                                    offset: variables.offset + activity.length,
                                    limit: variables.limit,
                                })
                            }}
                            disabled={!data.bankActivity.hasMore}
                            ml={4}
                            my={8}
                        >
                            {"next >"}
                        </Button>
                    </Flex>
                ) : null}
            </HStack>
        </>
    );
};
