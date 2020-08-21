import React from 'react'
import { Box, Heading, Text } from 'rebass'

import DoneAllIcon from '@material-ui/icons/DoneAll'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined'

export const NoMergeRequests: React.FunctionComponent = () => (
    <Box p={3} style={{ textAlign: 'center' }}>
        <Text my={2} fontSize={4}>
            <DoneAllIcon style={{ fontSize: '72px' }} color='action' fontSize='inherit' />
            <Heading my={2} fontSize={3}>
                There are no open merge requests
            </Heading>
        </Text>
    </Box>
)

export const LoadingMergeRequests: React.FunctionComponent = () => (
    <Box p={3} style={{ textAlign: 'center' }}>
        <CloudDownloadOutlinedIcon style={{ fontSize: '72px' }} color='action' fontSize='inherit' />
        <Heading my={2} fontSize={3}>
            Loading your merge requests
        </Heading>
    </Box>
)

export const CouldNotLoadMergeRequests: React.FunctionComponent = () => (
    <Box p={3} style={{ textAlign: 'center' }}>
        <ErrorOutlineIcon style={{ fontSize: '72px' }} color='error' fontSize='inherit' />
        <Heading my={2} fontSize={3}>
            Something went wrong
        </Heading>
        <Text>Could not load your merge requests</Text>
    </Box>
)
