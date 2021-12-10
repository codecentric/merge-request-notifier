import React from 'react'
import ReactDOM from 'react-dom'

import Application from './components/Application'

import 'typeface-ibm-plex-mono'
import './app.scss'

const mainElement = document.createElement('div')
document.body.appendChild(mainElement)

const render = (Component: React.FunctionComponent) => {
    ReactDOM.render(
        <Component />,
        mainElement,
    )
}

render(Application)
