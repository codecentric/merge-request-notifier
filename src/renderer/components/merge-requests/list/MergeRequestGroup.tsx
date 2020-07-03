import React from 'react'
import { Box, Text } from 'rebass'

interface MergeRequestGroupProps {
    label: string
}

export const MergeRequestGroup: React.FunctionComponent<MergeRequestGroupProps> = ({ label, children }) => (
    <Box>
        <Box py={1} px={2} sx={{ position: 'sticky', zIndex: 1, top: 0, borderBottom: '1px solid', borderColor: 'shadow' }} bg='siteBackground'>
            <Text fontWeight='bold' color='textColorTinted' letterSpacing={1} sx={{ textTransform: 'uppercase' }} fontSize={0}>
                {label}
            </Text>
        </Box>
        <Box m={0}>{children}</Box>
    </Box>
)
