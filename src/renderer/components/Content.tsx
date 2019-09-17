import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Box } from 'rebass'

import { useConfig } from '../hooks/config'
import { MergeRequestsPage } from './merge-requests/MergeRequestsPage'
import { SettingsPage } from './settings/SettingsPage'

export const Content: React.FunctionComponent = () => {
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
