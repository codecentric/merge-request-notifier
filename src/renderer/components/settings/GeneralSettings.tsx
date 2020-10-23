import React from 'react'
import { Box } from 'rebass'
import { Label, Select } from '@rebass/forms'

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
            updateSelectValue('openShortcut')({ target: { value: '' } } as any)
        }
    }

    const updateCheckoxValue = (name: keyof GeneralConfig) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newConfig = { ...values, [name]: event.target.checked }
        setValues(newConfig)
        updateGeneralConfig(newConfig)
    }

    const updateSelectValue = (name: keyof GeneralConfig) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newConfig = { ...values, [name]: event.target.value }
        setValues(newConfig)
        updateGeneralConfig(newConfig)
    }

    const updateTextValueOnChange = (name: keyof GeneralConfig) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newConfig = { ...values, [name]: event.target.value }
        setValues(newConfig)
    }

    const updateTextValueOnBlur = (name: keyof GeneralConfig) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newConfig = { ...values, [name]: event.target.value }
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
                <CheckboxInput
                    label='use dark mode theme'
                    id='darkMode'
                    name='darkMode'
                    defaultChecked={values.darkMode}
                    onChange={updateCheckoxValue('darkMode')}
                />
                <CheckboxInput
                    label='Start on login'
                    id='startOnLogin'
                    name='startOnLogin'
                    defaultChecked={values.startOnLogin}
                    onChange={updateCheckoxValue('startOnLogin')}
                />

                <CheckboxInput
                    label='Shortcut to open the app'
                    id='openShortcutCheckbox'
                    name='openShortcutCheckbox'
                    defaultChecked={showShortcutInput}
                    onChange={handleOpenShortcutCheckboxClick}
                />
                {showShortcutInput && (
                    <FormInput
                        id='openShortcut'
                        name='openShortcut'
                        placeholder='e.g. CmdOrCtrl+Shift+m'
                        indented={4}
                        info={<ShortcutInfo />}
                        value={values.openShortcut}
                        onChange={updateTextValueOnChange('openShortcut')}
                        onBlur={updateTextValueOnBlur('openShortcut')}
                    />
                )}

                <Box>
                    <Label mb={1} fontWeight='bold' fontSize={1} htmlFor='trayIconForDarkMode'>
                        Tray icon
                    </Label>
                    <Select
                        id='trayIconForDarkMode'
                        name='trayIconForDarkMode'
                        defaultValue={values.trayIconForDarkMode}
                        style={{ borderRadius: 0 }}
                        onChange={updateSelectValue('trayIconForDarkMode')}
                    >
                        <option value='system' key='system'>
                            System Defaults
                        </option>
                        <option value='darkMode' key='darkMode'>
                            Force dark mode
                        </option>
                        <option value='lightMode' key='lightMode'>
                            Force light mode
                        </option>
                    </Select>
                </Box>
            </form>
        </Box>
    )
}
