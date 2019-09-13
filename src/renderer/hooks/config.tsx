import * as React from 'react'

export interface Config {
    url: string
    groups: string[]
    token: string
}

interface ConfigContext {
    config: Config | null
    removeConfig: () => void
    updateConfig: (newConfig: Config) => void
}

const Context = React.createContext<ConfigContext | null>(null)

export function useConfig() {
    const context = React.useContext(Context)
    if (!context) {
        throw new Error('Please use the ConfigProvider')
    }
    return context
}

const configFromPreviousVersion = (): Config | null => {
    const localStorageValue = window.localStorage.getItem('config')

    if (localStorageValue) {
        const config = JSON.parse(localStorageValue)

        const newConfig = {
            url: config.url,
            groups: [config.group],
            token: config.token,
        }

        window.localStorage.setItem('config.v2', JSON.stringify(newConfig))
        window.localStorage.removeItem('config')

        return newConfig
    }

    return null
}

export const ConfigProvider = ({ ...props }) => {
    const localStorageValue = window.localStorage.getItem('config.v2')
    const [config, setConfig] = React.useState<Config | null>(localStorageValue ? JSON.parse(localStorageValue) : configFromPreviousVersion())

    const removeConfig = () => {
        setConfig(null)
        window.localStorage.removeItem('config.v2')
    }
    const updateConfig = (newConfig: Config) => {
        setConfig(newConfig)
        window.localStorage.setItem('config.v2', JSON.stringify(newConfig))
    }

    return <Context.Provider value={{ config, updateConfig, removeConfig }} {...props} />
}
