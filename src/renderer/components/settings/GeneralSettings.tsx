import * as React from 'react'
import { Box } from 'rebass'
import { CheckboxInput } from './CheckboxInput'
import { useConfig } from '../../hooks/config'

interface FormData {
    useNotifications: boolean
}

export const GeneralSettings: React.FunctionComponent = () => {
    const { config, updateGeneralConfig } = useConfig()

    const [values, setValues] = React.useState<FormData>({
        useNotifications: config.generalConfig.useNotifications,
    })

    const save = (name: keyof FormData) => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newConfig = { ...values, [name]: event.target.checked }
        setValues(newConfig)
        updateGeneralConfig(newConfig)
    }

    return (
        <>
            <Box p={2}>
                <form autoComplete='off'>
                    <CheckboxInput
                        label='Send me a notification for new MRs'
                        id='useNotifications'
                        name='useNotifications'
                        defaultChecked={values.useNotifications}
                        onChange={save('useNotifications')}
                    />
                </form>
            </Box>
        </>
    )
}
