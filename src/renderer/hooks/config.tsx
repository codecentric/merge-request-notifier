import * as React from 'react'
import { remote } from 'electron'
import * as settings from 'electron-settings'

const electronSettings: typeof settings = remote.require('electron-settings')

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

const configFromPreviousVersionOrDefault = (): Config => {
    const localStorageConfig = window.localStorage.getItem('config.v3')

    if (localStorageConfig) {
        const config = JSON.parse(localStorageConfig)

        electronSettings.set('config.v3', config as any)
        window.localStorage.removeItem('config.v3')

        return config
    }

    return defaultConfig
}

const loadConfig = (): Config => {
    const savedConfig = electronSettings.get('config.v3') as Config | null

    if (savedConfig) {
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
        electronSettings.delete('config.v3')
    }

    const updateConfig = (newConfig: Config) => {
        setConfig(newConfig)
        electronSettings.set('config.v3', newConfig as any)
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
