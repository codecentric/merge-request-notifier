import * as React from 'react'
import '@reach/tabs/styles.css'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { ConnectionSettings } from './ConnectionSettings'
import { GeneralSettings } from './GeneralSettings'
import { Text } from 'rebass'
import { useConfig } from '../../hooks/config'

export const SettingsPage: React.FunctionComponent = () => {
    const { config } = useConfig()
    const backgroundColor = config.generalConfig.darkMode ? '#000' : '#e8e8e8'

    return (
        <>
            <Tabs defaultIndex={config.connectionConfig ? 0 : 1}>
                <TabList style={{ position: 'sticky', top: 0, backgroundColor, borderBottom: '1px solid #a9a9a9' }}>
                    <Tab>
                        <Text>General</Text>
                    </Tab>
                    <Tab>
                        <Text>Connection</Text>
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <GeneralSettings />
                    </TabPanel>
                    <TabPanel>
                        <ConnectionSettings />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}
