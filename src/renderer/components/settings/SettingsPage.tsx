import * as React from 'react'
import '@reach/tabs/styles.css'
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@reach/tabs'
import { ConnectionSettings } from './ConnectionSettings'
import { GeneralSettings } from './GeneralSettings'

export const SettingsPage: React.FunctionComponent = () => {
    return (
        <>
            <Tabs>
                <TabList>
                    <Tab>Connection</Tab>
                    <Tab>General</Tab>
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
