import * as React from 'react'
import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom'
import { Box } from 'rebass'

import { useConfig } from '../hooks/config'
import { MergeRequestsPage } from './merge-requests/MergeRequestsPage'
import { SettingsPage } from './settings/SettingsPage'
import { AboutUsPage } from './about-us/AboutUsPage'
import { UpdateInfoPage } from './update/UpdateInfoPage'
import { NewUpdateAlert } from './update/NewUpdateAlert'
import { lightTheme } from './theme-light'
import { darkTheme } from './theme-dark'
import { Wrapper } from './layout/Wrapper'
import { Header } from './layout/Header'
import { Main } from './layout/Main'
import { ThemeProvider } from 'emotion-theming'
import { Footer } from './layout/Footer'

export const Content: React.FunctionComponent = () => {
    const { config } = useConfig()

    const theme = config.generalConfig.darkMode ? darkTheme : lightTheme

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Wrapper>
                    <Header />
                    <Main>
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
                                {config.connectionConfig ? (
                                    <Route path='/'>
                                        <NewUpdateAlert />
                                        <MergeRequestsPage />
                                    </Route>
                                ) : (
                                    <Redirect to='/config' />
                                )}
                            </Switch>
                        </Box>
                    </Main>
                    <Footer />
                </Wrapper>
            </BrowserRouter>
        </ThemeProvider>
    )
}
