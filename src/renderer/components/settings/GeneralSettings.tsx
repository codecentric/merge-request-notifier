import * as React from 'react'
import { Box } from 'rebass'
import { useConfig } from '../../hooks/config'
import { CheckboxInput } from '../form/CheckboxInput'

interface FormData {
    useNotifications: boolean
    disableWipNotifications: boolean
    darkMode: boolean
}

export const GeneralSettings: React.FunctionComponent = () => {
    const { config, updateGeneralConfig } = useConfig()

    const [values, setValues] = React.useState<FormData>({
        ...config.generalConfig,
    })

    const updateGeneralSettings = (name: keyof FormData) => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newConfig = { ...values, [name]: event.target.checked }
        setValues(newConfig)
        updateGeneralConfig(newConfig)
    }

    return (
        <Box p={2}>
            <form autoComplete='off'>
                <CheckboxInput
                    label='Notify about new merge requests'
                    id='useNotifications'
                    name='useNotifications'
                    defaultChecked={values.useNotifications}
                    onChange={updateGeneralSettings('useNotifications')}
                />
                {values.useNotifications && (
                    <CheckboxInput
                        label='Ignore WIP merge requests'
                        id='ignoreWip'
                        name='ignoreWip'
                        indented={3}
                        defaultChecked={values.disableWipNotifications}
                        onChange={updateGeneralSettings('disableWipNotifications')}
                    />
                )}
                <CheckboxInput label='Dark mode' id='darkMode' name='darkMode' defaultChecked={values.darkMode} onChange={updateGeneralSettings('darkMode')} />
            </form>
        </Box>
    )
}
