import * as React from 'react'
import { Box, Heading, Text } from 'rebass'

import DoneAllIcon from '@material-ui/icons/DoneAll'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

export const NoMergeRequests: React.FunctionComponent = () => (
    <Box p={3}>
        <Text my={2} fontSize={3}>
            <DoneAllIcon color='action' /> There are no open merge requests
        </Text>
    </Box>
)

export const CouldNotLoadMergeRequests: React.FunctionComponent = () => (
    <Box p={3}>
        <Heading my={2} fontSize={3}>
            <ErrorOutlineIcon color='error' /> Something went wrong
        </Heading>
        <Text>Could not load your merge requests</Text>
    </Box>
)
