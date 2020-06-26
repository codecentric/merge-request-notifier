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
    token?: string
    projects?: ProjectsConfig
}

export interface GeneralConfig {
    useNotifications: boolean
    disableWipNotifications: boolean
    darkMode: boolean
    trayIconForDarkMode: 'system' | 'darkMode' | 'lightMode'
    startOnLogin: boolean
    openShortcut: string
    showOpenMergeRequestsInTrayIcon: boolean
}

export const DEFAULT_CONFIG: Config = {
    generalConfig: {
        useNotifications: true,
        disableWipNotifications: true,
        trayIconForDarkMode: 'system',
        darkMode: false,
        startOnLogin: true,
        openShortcut: 'CmdOrCtrl+Shift+m',
        showOpenMergeRequestsInTrayIcon: true,
    },
}
