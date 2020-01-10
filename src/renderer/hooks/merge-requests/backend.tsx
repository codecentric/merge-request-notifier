import * as React from 'react'

import { Config, useConfig } from '../config'
import { loadData, loadGroups } from './loadData'
import { GroupedMergeRequest, MergeRequestWithProject } from './types'

export interface BackendContext {
    isLoading: boolean
    groupedMergeRequests: GroupedMergeRequest[] | undefined
    mergeRequestWithProjects: MergeRequestWithProject[] | undefined
    testConfig: (config: Config) => Promise<boolean>
}

const Context = React.createContext<BackendContext | null>(null)

export function useBackend() {
    const context = React.useContext(Context)
    if (context === null) {
        throw new Error('Please use the BackendProvider')
    }
    return context
}

export const BackendProvider = ({ ...props }) => {
    const { config } = useConfig()
    const [groupedMergeRequests, setGroupedMergeRequests] = React.useState<GroupedMergeRequest[] | undefined>(undefined)
    const [mergeRequestWithProjects, setMergeRequestWithProjects] = React.useState<MergeRequestWithProject[] | undefined>(undefined)
    const [loadErrors, setLoadErrors] = React.useState<number>(0)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)

    const updateData = async (newConfig?: Config) => {
        try {
            const configToUse = newConfig || config
            if (configToUse) {
                setIsLoading(true)
                const data = await loadData(configToUse)
                setGroupedMergeRequests(data.groupedMergeRequests)
                setMergeRequestWithProjects(data.mergeRequestWithProjects)
                setLoadErrors(0)
            }
        } catch (error) {
            console.error(error)
            setLoadErrors(loadErrors + 1)
            if (loadErrors > 2) {
                setGroupedMergeRequests(undefined)
                setMergeRequestWithProjects(undefined)
            }
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        updateData()
        const interval = setInterval(updateData, 10000)

        return () => {
            clearInterval(interval)
        }
    }, [config])

    const testConfig = async (newConfig: Config): Promise<boolean> => {
        setIsLoading(true)
        return loadGroups(newConfig)
            .then(() => true)
            .catch(() => false)
            .then(validConfig => {
                setIsLoading(false)
                return validConfig
            })
    }

    return <Context.Provider value={{ isLoading, groupedMergeRequests, mergeRequestWithProjects, testConfig }} {...props} />
}
