import * as React from 'react'
import { Box, Text } from 'rebass'

interface MergeRequestGroupProps {
    label: string
}

export const MergeRequestGroup: React.FunctionComponent<MergeRequestGroupProps> = ({ label, children }) => (
    <>
        <Box p={2}>
            <Text fontWeight='bold' color='gray' letterSpacing={1} sx={{ textTransform: 'uppercase' }} fontSize={1}>
                {label}
            </Text>
        </Box>
        <Box m={0}>{children}</Box>
    </>
)
