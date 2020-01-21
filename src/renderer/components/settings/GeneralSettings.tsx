import * as React from 'react'
import { Box } from 'rebass'
import { useConfig } from '../../hooks/config'
import { CheckboxInput } from '../form/CheckboxInput'

interface FormData {
    useNotifications: boolean
    darkMode: boolean
}

export const GeneralSettings: React.FunctionComponent = () => {
    const { config, updateGeneralConfig } = useConfig()

    const [values, setValues] = React.useState<FormData>({
        useNotifications: config.generalConfig.useNotifications,
        darkMode: config.generalConfig.darkMode,
    })

    const updateGeneralSettings = (name: keyof FormData) => async (event: React.ChangeEvent<HTMLInputElement>) => {
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
                        onChange={updateGeneralSettings('useNotifications')}
                    />
                    <CheckboxInput
                        label='Dark mode'
                        id='darkMode'
                        name='darkMode'
                        defaultChecked={values.darkMode}
                        onChange={updateGeneralSettings('darkMode')}
                    />
                </form>
            </Box>
        </>
    )
}
