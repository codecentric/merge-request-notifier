import * as React from 'react'
import '@reach/tabs/styles.css'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { ConnectionSettings } from './ConnectionSettings'
import { GeneralSettings } from './GeneralSettings'
import { Text } from 'rebass'

export const SettingsPage: React.FunctionComponent = () => {
    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>
                        <Text>Connection</Text>
                    </Tab>
                    <Tab>
                        <Text>General</Text>
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
