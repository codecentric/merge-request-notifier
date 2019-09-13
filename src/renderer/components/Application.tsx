import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'

import { Header } from './layout/Header'
import { Footer } from './layout/Footer'
import { theme } from './theme'
import { ConfigProvider } from '../hooks/config'
import { BackendProvider } from '../hooks/backend'
import { Content } from './Content'
import { Wrapper } from './layout/Wrapper'
import { Main } from './layout/Main'

const Application = () => {
    return (
        <ConfigProvider>
            <BackendProvider>
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
            </BackendProvider>
        </ConfigProvider>
    )
}

export default hot(Application)
