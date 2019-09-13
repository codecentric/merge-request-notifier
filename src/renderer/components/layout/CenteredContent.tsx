import * as React from 'react'
import { Box, Flex } from 'rebass'

export const CenteredContent: React.FunctionComponent = ({ children }) => (
    <Flex height={1} justifyContent='center' alignItems='center'>
        <Box>{children}</Box>
    </Flex>
)
