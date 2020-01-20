import * as React from 'react'
import '@reach/tabs/styles.css'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { ConnectionSettings } from './ConnectionSettings'
import { GeneralSettings } from './GeneralSettings'
import { Text } from 'rebass'
import { lightTheme } from '../theme-light'
import { darkTheme } from '../theme-dark'
import { useConfig } from '../../hooks/config'

export const SettingsPage: React.FunctionComponent = () => {
    const { config } = useConfig()
    const borderColor = config.generalConfig.darkMode ? darkTheme.colors.textColor : lightTheme.colors.textColor
    return (
        <>
            <Tabs>
                <TabList style={{ border: borderColor }}>
                    <Tab>
                        <Text color='textColor'>Connection</Text>
                    </Tab>
                    <Tab>
                        <Text color='textColor'>General</Text>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <ConnectionSettings />
                    </TabPanel>
                    <TabPanel>
                        <GeneralSettings />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}
