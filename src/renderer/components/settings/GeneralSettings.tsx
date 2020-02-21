import * as React from 'react'
import { Box } from 'rebass'

import { useConfig } from '../../hooks/config'
import { CheckboxInput } from '../form/CheckboxInput'
import { FormInput } from '../form/FormInput'
import { GeneralConfig } from '../../../share/config'
import { ShortcutInfo } from './ShortcutInfo'

export const GeneralSettings: React.FunctionComponent = () => {
    const { config, updateGeneralConfig } = useConfig()

    const [showShortcutInput, setShowShortcutInput] = React.useState(config.generalConfig.openShortcut !== '')

    const [values, setValues] = React.useState<GeneralConfig>({
        ...config.generalConfig,
    })

    const handleOpenShortcutCheckboxClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setShowShortcutInput(true)
        } else {
            setShowShortcutInput(false)
            updateTextValue('openShortcut')({ target: { value: '' } } as any)
        }
    }

    const updateCheckoxValue = (name: keyof GeneralConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newConfig = { ...values, [name]: event.target.checked }
        setValues(newConfig)
        updateGeneralConfig(newConfig)
    }

    const updateTextValue = (name: keyof GeneralConfig) => async (event: React.ChangeEvent<HTMLInputElement>) => {
        const newConfig = { ...values, [name]: event.target.value }
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
                    onChange={updateCheckoxValue('useNotifications')}
                />
                {values.useNotifications && (
                    <CheckboxInput
                        label='Ignore WIP merge requests'
                        id='ignoreWip'
                        name='ignoreWip'
                        indented={3}
                        defaultChecked={values.disableWipNotifications}
                        onChange={updateCheckoxValue('disableWipNotifications')}
                    />
                )}
                <CheckboxInput label='Dark mode' id='darkMode' name='darkMode' defaultChecked={values.darkMode} onChange={updateCheckoxValue('darkMode')} />
                <CheckboxInput
                    label='Start on Login'
                    id='startOnLogin'
                    name='startOnLogin'
                    defaultChecked={values.startOnLogin}
                    onChange={updateCheckoxValue('startOnLogin')}
                />
                <CheckboxInput
                    label='Shortcut to open the App'
                    id='openShortcutCheckbox'
                    name='openShortcutCheckbox'
                    defaultChecked={showShortcutInput}
                    onChange={handleOpenShortcutCheckboxClick}
                />

                {showShortcutInput && (
                    <FormInput
                        id='openShortcut'
                        name='openShortcut'
                        placeholder='CmdOrCtrl+Shift+m'
                        indented={4}
                        info={<ShortcutInfo />}
                        value={values.openShortcut}
                        onChange={updateTextValue('openShortcut')}
                    />
                )}
            </form>
        </Box>
    )
}
