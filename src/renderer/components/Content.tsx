import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Box } from 'rebass'

import { useConfig } from '../hooks/config'
import { MergeRequestsPage } from './merge-requests/MergeRequestsPage'
import { SettingsPage } from './settings/SettingsPage'
import { AboutUsPage } from './about-us/AboutUsPage'

export const Content: React.FunctionComponent = () => {
    const { config } = useConfig()

    return (
        <Box>
            <Switch>
                <Route path='/config'>
                    <SettingsPage />
                </Route>
                <Route path='/about-us'>
                    <AboutUsPage />
                </Route>
                {config ? (
                    <Route path='/'>
                        <MergeRequestsPage />
                    </Route>
                ) : (
                    <Redirect to='/config' />
                )}
            </Switch>
        </Box>
    )
}
