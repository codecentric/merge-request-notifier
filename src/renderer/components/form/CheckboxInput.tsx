import React from 'react'
import { Box, Text } from 'rebass'
import { Label, Checkbox } from '@rebass/forms'

interface FormCheckboxProps {
    id: string
    label: string
    name: string
    info?: string | JSX.Element
    error?: string
    indented?: number
    [htmlAttribute: string]: any
}

export const CheckboxInput: React.FunctionComponent<FormCheckboxProps> = ({ id, name, label, info, error, indented, ...props }) => (
    <Box mb={3} ml={indented || 0}>
        <Label fontWeight='bold' fontSize={1} htmlFor={id}>
            <Checkbox id={id} name={name} {...props} />
            <Text p='3.5px'>{label}</Text>
        </Label>
        {(!!error || !!info) && (
            <Text mt={1} mb={2} fontSize={1} lineHeight={1.4} color={!!error ? 'red' : ''}>
                {error || info}
            </Text>
        )}
    </Box>
)
