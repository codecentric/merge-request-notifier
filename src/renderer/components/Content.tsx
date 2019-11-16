import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Box } from 'rebass'

import { useConfig } from '../hooks/config'
import { MergeRequestsPage } from './merge-requests/MergeRequestsPage'
import { SettingsPage } from './settings/SettingsPage'
import { AboutUsPage } from './about-us/AboutUsPage'
import { UpdateInfoPage } from './update/UpdateInfoPage'
import { useUpdater } from '../hooks/updater'
import { NewUpdateAlert } from './update/NewUpdateAlert'

export const Content: React.FunctionComponent = () => {
    const { config } = useConfig()
    const { updateInfo } = useUpdater()

    return (
        <Box>
            <Switch>
                <Route path='/config'>
                    <SettingsPage />
                </Route>
                <Route path='/about-us'>
                    <AboutUsPage />
                </Route>
                <Route path='/update'>
                    <UpdateInfoPage />
                </Route>
                {config ? (
                    <Route path='/'>
                        {updateInfo && <NewUpdateAlert />}
                        <MergeRequestsPage />
                    </Route>
                ) : (
                    <Redirect to='/config' />
                )}
            </Switch>
        </Box>
    )
}
