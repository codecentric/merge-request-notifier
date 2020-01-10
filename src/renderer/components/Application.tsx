import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'

import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { theme } from './theme'
import { ConfigProvider } from '../hooks/config'
import { BackendProvider } from '../hooks/merge-requests/backend'
import { UpdaterProvider } from '../hooks/updater'
import { Content } from './Content'
import { Wrapper } from './layout/Wrapper'
import { Main } from './layout/Main'
import { NotificationsEmiter } from './NotificationsEmiter'

const Application: React.FunctionComponent = () => (
    <ConfigProvider>
        <BackendProvider>
            <UpdaterProvider>
                <NotificationsEmiter />
                <ThemeProvider theme={theme}>
                    <BrowserRouter>
                        <Wrapper>
                            <Header />
                            <Main>
                                <Content />
                            </Main>
                            <Footer />
                        </Wrapper>
                    </BrowserRouter>
                </ThemeProvider>
            </UpdaterProvider>
        </BackendProvider>
    </ConfigProvider>
)

export default hot(Application)
