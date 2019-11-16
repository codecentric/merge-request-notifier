import * as React from 'react'
import { Box, Flex, Text } from 'rebass'
import { Link } from 'react-router-dom'

export const NewUpdateAlert = () => {
    return (
        <Box py={1} px={2} sx={{ position: 'sticky', zIndex: 2, top: 0, borderBottom: '1px solid', borderColor: 'shadow' }} bg='siteBackground'>
            <Text fontWeight='bold' color='red' letterSpacing={1} sx={{ textTransform: 'uppercase' }} fontSize={'12px'}>
                <Flex justifyContent='space-between'>
                    <span>New update available</span>
                    <Link to='/update' title='Update details'>
                        Details
                    </Link>
                </Flex>
            </Text>
        </Box>
    )
}
