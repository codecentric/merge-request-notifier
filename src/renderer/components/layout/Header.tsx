import * as React from 'react'
import { Box, Heading } from 'rebass'

export const Header = () => (
    <Box p={2} bg='white' sx={{ borderBottom: '1px solid', overflow: 'hidden', borderColor: 'shadow' }}>
        <Heading textAlign='center' fontWeight='bold' fontSize={2}>
            Merge Requests
        </Heading>
    </Box>
)
