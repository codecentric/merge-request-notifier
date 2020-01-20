import * as React from 'react'
import { Box, Text } from 'rebass'
import { Label, Input } from '@rebass/forms'

interface FormInputProps {
    id: string
    label: string
    info?: string | JSX.Element
    error?: string
    [htmlAttribute: string]: any
}

export const FormInput: React.FunctionComponent<FormInputProps> = ({ id, label, error, info, ...props }) => (
    <Box mb={3}>
        <Label fontWeight='bold' fontSize={1} htmlFor={id} mb={1} color='textColor'>
            {label}
        </Label>
        <Input fontSize={2} id={id} {...props} sx={{ background: 'lightBackground', color: 'textColor' }} />
        {(!!error || !!info) && (
            <Text mt={1} mb={2} fontSize={1} lineHeight={1.4} color={!!error ? 'red' : 'textColor'}>
                {error || info}
            </Text>
        )}
    </Box>
)
