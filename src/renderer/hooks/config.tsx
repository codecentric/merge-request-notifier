import * as React from 'react'
import { remote } from 'electron'

export interface Config {
    connectionConfig?: ConnectionConfig
    generalConfig: GeneralConfig
}

export interface ProjectsConfig {
    [group: string]: string[]
}

export interface ConnectionConfig {
    url: string
    groups: string[]
    token: string
    projects?: ProjectsConfig
}

export interface GeneralConfig {
    useNotifications: boolean
    disableWipNotifications: boolean
    darkMode: boolean
}

interface ConfigContext {
    config: Config
    removeConfig: () => void
    updateConnectionConfig: (newConnectionConfig: ConnectionConfig) => void
    updateGeneralConfig: (newGeneralConfig: GeneralConfig) => void
}

const defaultConfig: Config = {
    generalConfig: {
        useNotifications: true,
        disableWipNotifications: true,
        darkMode: remote.nativeTheme.shouldUseDarkColors,
    },
}

const Context = React.createContext<ConfigContext | null>(null)

export function useConfig() {
    const context = React.useContext(Context)
    if (!context) {
        throw new Error('Please use the ConfigProvider')
    }
    return context
}

const configPreviousVersion = (oldKey: string, newKey: string): Config | null => {
    const localStorageValue = window.localStorage.getItem(oldKey)

    if (localStorageValue) {
        const config = JSON.parse(localStorageValue)

        const newConfig = {
            ...defaultConfig,
            connectionConfig: {
                url: config.url,
                groups: config.group ? [config.group] : config.groups,
                token: config.token,
            },
        }

        window.localStorage.setItem(newKey, JSON.stringify(newConfig))
        window.localStorage.removeItem(oldKey)

        return newConfig
    }
    return null
}

const configFromPreviousVersionOrDefault = (): Config => {
    return configPreviousVersion('config', 'config.v3') || configPreviousVersion('config.v2', 'config.v3') || defaultConfig
}

const loadConfig = (): Config => {
    const localStorageValue = window.localStorage.getItem('config.v3')

    if (localStorageValue) {
        const savedConfig = JSON.parse(localStorageValue)

        return {
            connectionConfig: savedConfig.connectionConfig,
            generalConfig: {
                ...defaultConfig.generalConfig,
                ...savedConfig.generalConfig,
            },
        }
    }

    return configFromPreviousVersionOrDefault()
}

export const ConfigProvider = ({ ...props }) => {
    const [config, setConfig] = React.useState<Config>(loadConfig())

    const removeConfig = () => {
        setConfig(defaultConfig)
        window.localStorage.removeItem('config.v3')
    }

    const updateConfig = (newConfig: Config) => {
        setConfig(newConfig)
        window.localStorage.setItem('config.v3', JSON.stringify(newConfig))
    }

    const updateConnectionConfig = (newConnectionConfig: ConnectionConfig) => {
        const newConfig: Config = {
            ...config,
            connectionConfig: newConnectionConfig,
        }
        updateConfig(newConfig)
    }

    const updateGeneralConfig = (newGeneralConfig: GeneralConfig) => {
        const newConfig: Config = {
            ...config,
            generalConfig: newGeneralConfig,
        }
        updateConfig(newConfig)
    }

    return <Context.Provider value={{ config, removeConfig, updateConnectionConfig, updateGeneralConfig }} {...props} />
}
