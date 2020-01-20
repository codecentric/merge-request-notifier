import * as React from 'react'
import { Box } from 'rebass'

export const Main: React.FunctionComponent = ({ children }) => (
    <Box sx={{ overflowY: 'scroll' }} bg='defaultBackground'>
        {children}
    </Box>
)
