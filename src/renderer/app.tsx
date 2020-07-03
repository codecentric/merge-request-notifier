import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import Application from './components/Application'
import { reportUnhandledRejections } from '../share/reportUnhandledRejections'

import 'typeface-ibm-plex-mono'
import './app.scss'

reportUnhandledRejections()

const mainElement = document.createElement('div')
document.body.appendChild(mainElement)

const render = (Component: React.FunctionComponent) => {
    ReactDOM.render(
        <AppContainer>
            <Component />
        </AppContainer>,
        mainElement,
    )
}

render(Application)
