import * as React from 'react'

interface Config {
    url: string
    group: string
    token: string
}

interface ConfigContext {
    config: Config | null
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

export const ConfigProvider = ({ ...props }) => {
    const localStorageValue = window.localStorage.getItem('config')
    const [config, setConfig] = React.useState<Config | null>(localStorageValue ? JSON.parse(localStorageValue) : null)

    const updateConfig = (newConfig: Config) => {
        setConfig(newConfig)
        window.localStorage.setItem('config', JSON.stringify(newConfig))
    }

    return <Context.Provider value={{ config, updateConfig }} {...props} />
}
