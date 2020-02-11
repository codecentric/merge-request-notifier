import * as React from 'react'
import { Box, Text } from 'rebass'
import { Label, Input } from '@rebass/forms'

interface IndentedFormInputProps {
    id: string
    label: string
    [htmlAttribute: string]: any
}

export const IndentedFormInput: React.FunctionComponent<IndentedFormInputProps> = ({ id, label, ...props }) => (
    <Box mb={2} ml={3}>
        <Label fontWeight='bold' fontSize={1} htmlFor={id} mb={1}>
            {label}
        </Label>
        <Input fontSize={2} id={id} {...props} sx={{ background: 'lightBackground' }} />
    </Box>
)
