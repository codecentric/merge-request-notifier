import * as React from 'react'
import { Box } from '@material-ui/core'
import { Switch, Route } from 'react-router-dom'

import { useConfig } from '../hooks/config'
import { MergeRequests } from './MergeRequests'
import { SettingsPage } from './SettingsPage'

export const Content = () => {
    const { config } = useConfig()

    return (
        <Box>
            <Switch>
                <Route path='/config' component={SettingsPage} />
                {config ? <Route path='/' component={MergeRequests} /> : <Route path='/' component={SettingsPage} />}
            </Switch>
        </Box>
    )
}
