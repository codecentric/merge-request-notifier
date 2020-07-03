import React from 'react'
import { Box, Heading, Text } from 'rebass'

import DoneAllIcon from '@material-ui/icons/DoneAll'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

export const NoMergeRequests: React.FunctionComponent = () => (
    <Box p={3}>
        <Text my={2} fontSize={4}>
            <DoneAllIcon color='action' /> There are no open merge requests
        </Text>
    </Box>
)

export const CouldNotLoadMergeRequests: React.FunctionComponent = () => (
    <Box p={3} style={{ textAlign: 'center' }}>
        <ErrorOutlineIcon style={{ fontSize: '72px' }} color='error' fontSize='inherit' />
        <Heading my={2} fontSize={4}>
            Something went wrong
        </Heading>
        <Text>Could not load your merge requests</Text>
    </Box>
)
