import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { ConfigProvider } from '../hooks/config'
import { BackendProvider } from '../hooks/merge-requests/backend'
import { UpdaterProvider } from '../hooks/updater'
import { Content } from './Content'
import { NotificationsEmiter } from './NotificationsEmiter'

const Application: React.FunctionComponent = () => {
    return (
        <ConfigProvider>
            <BackendProvider>
                <UpdaterProvider>
                    <NotificationsEmiter />
                    <Content />
                </UpdaterProvider>
            </BackendProvider>
        </ConfigProvider>
    )
}

export default hot(Application)
