import * as React from 'react'
import { Box } from 'rebass'

export const Wrapper: React.FunctionComponent = ({ children }) => (
    <Box sx={{ display: 'grid', gridTemplateRows: '2.25rem auto 2.25rem', height: '100vh' }}>{children}</Box>
)
