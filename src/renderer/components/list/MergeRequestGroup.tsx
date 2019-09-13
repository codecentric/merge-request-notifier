import * as React from 'react'
import { Box, Text } from 'rebass'

interface MergeRequestGroupProps {
    label: string
}

export const MergeRequestGroup: React.FunctionComponent<MergeRequestGroupProps> = ({ label, children }) => (
    <Box>
        <Box py={1} px={2} sx={{ position: 'sticky', top: 0 }} bg='siteBackground'>
            <Text fontWeight='bold' color='gray' letterSpacing={1} sx={{ textTransform: 'uppercase' }} fontSize={1}>
                {label}
            </Text>
        </Box>
        <Box m={0}>{children}</Box>
    </Box>
)
