import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Box } from 'rebass'

import { useConfig } from '../hooks/config'
import { MergeRequestsPage } from './pages/MergeRequestsPage'
import { SettingsPage } from './pages/SettingsPage'

export const Content = () => {
    const { config } = useConfig()

    return (
        <Box>
            <Switch>
                <Route path='/config' component={SettingsPage} />
                {config ? <Route path='/' component={MergeRequestsPage} /> : <Route path='/' component={SettingsPage} />}
            </Switch>
        </Box>
    )
}
