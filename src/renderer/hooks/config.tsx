import React from 'react'
import { ipcRenderer } from 'electron'
import * as log from 'electron-log'

import { Config, ConnectionConfig, DEFAULT_CONFIG, GeneralConfig } from '../../share/config'

interface ConfigContext {
    config: Config
    removeConfig: () => void
    updateConnectionConfig: (newConnectionConfig: ConnectionConfig) => void
    updateGeneralConfig: (newGeneralConfig: GeneralConfig) => void
}

const Context = React.createContext<ConfigContext | null>(null)

export function useConfig() {
    const context = React.useContext(Context)
    if (!context) {
        throw new Error('Please use the ConfigProvider')
    }
    return context
}

const getAndTransferLocalStorageConfig = (): Config | undefined => {
    const localStorageConfig = window.localStorage.getItem('config.v3')

    if (localStorageConfig) {
        const config: Config = JSON.parse(localStorageConfig)
        const configToTransfer = {
            connectionConfig: config.connectionConfig,
            generalConfig: {
                ...DEFAULT_CONFIG.generalConfig,
                ...config.generalConfig,
            },
        }

        ipcRenderer.send('set-config', configToTransfer)
        window.localStorage.removeItem('config.v3')

        return configToTransfer
    }
}

const loadConfig = (): Config => {
    const oldConfig = getAndTransferLocalStorageConfig()
    if (oldConfig) {
        log.info('Found and converted a previous local storage config')
        return oldConfig
    }

    return ipcRenderer.sendSync('get-config') as Config
}

const SAVED_CONFIG = loadConfig()

export const ConfigProvider = ({ ...props }) => {
    const [config, setConfig] = React.useState<Config>(SAVED_CONFIG)

    const removeConfig = () => {
        const defaultConfig = ipcRenderer.sendSync('remove-config')
        setConfig(defaultConfig)
    }

    const updateConfig = (newConfig: Config) => {
        setConfig(newConfig)
        ipcRenderer.send('set-config', newConfig)
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
