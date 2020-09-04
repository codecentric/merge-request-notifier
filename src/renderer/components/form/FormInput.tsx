import React from 'react'
import { Box, Text } from 'rebass'
import { Label, Input } from '@rebass/forms'

interface FormInputProps {
    id: string
    label?: string
    info?: string | JSX.Element
    error?: string
    indented?: number
    [htmlAttribute: string]: any
}

export const FormInput: React.FunctionComponent<FormInputProps> = ({ id, label, info, error, indented, ...props }) => (
    <Box mb={3} ml={indented || 0} width='100%'>
        {label && (
            <Label fontWeight='bold' fontSize={1} htmlFor={id} mb={1}>
                {label}
            </Label>
        )}
        <Input fontSize={2} id={id} {...props} sx={{ background: 'lightBackground' }} />
        {(!!error || !!info) && (
            <Text mt={1} mb={2} fontSize={1} lineHeight={1.4} color={!!error ? 'red' : ''}>
                {error || info}
            </Text>
        )}
    </Box>
)
