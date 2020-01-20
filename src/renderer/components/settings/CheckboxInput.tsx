import * as React from 'react'
import { Box, Text } from 'rebass'
import { Label, Checkbox } from '@rebass/forms'

interface FormCheckboxProps {
    id: string
    label: string
    name: string
    info?: string | JSX.Element
    error?: string
    [htmlAttribute: string]: any
}

export const CheckboxInput: React.FunctionComponent<FormCheckboxProps> = ({ id, label, error, info, ...props }) => (
    <Box mb={3}>
        <Label fontWeight='bold' fontSize={1} htmlFor={id}>
            <Checkbox id={id} name={name} {...props} />
            <Text p='3.5px' color='textColor'>
                {label}
            </Text>
        </Label>
        {(!!error || !!info) && (
            <Text mt={1} mb={2} fontSize={1} lineHeight={1.4} color={!!error ? 'red' : 'textColor'}>
                {error || info}
            </Text>
        )}
    </Box>
)
