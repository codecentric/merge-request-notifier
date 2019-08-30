import * as React from 'react'
import * as request from 'superagent'

import { Config, useConfig } from './config'

export interface GitLabUser {
    id: number
    name: string
    username: string
    state: 'active' | 'inactive' | 'blocked'
    avatar_url?: string
    web_url: string
}

export interface MergeRequest {
    id: number
    iid: number
    project_id: number
    title: string
    description: string
    state: 'opened' | 'closed' | 'locked' | 'merged'
    merged_by?: GitLabUser
    merged_at?: string
    closed_by?: GitLabUser
    closed_at?: string
    created_at: string
    updated_at: string
    target_branch: string
    source_branch: string
    upvotes: number
    downvotes: number
    author: GitLabUser
    assignee?: GitLabUser
    assignees: GitLabUser[]
    source_project_id: number
    target_project_id: number
    labels: string[]
    work_in_progress: boolean
    merge_when_pipeline_succeeds: boolean
    merge_status: 'can_be_merged'
    user_notes_count: number
    should_remove_source_branch: boolean
    web_url: string
}

export interface BackendContext {
    mergeRequests: MergeRequest[] | undefined
    testConfig: (config: Config) => Promise<void>
    reset: () => void
}

const Context = React.createContext<BackendContext | null>(null)

export function useBackend() {
    const context = React.useContext(Context)
    if (context === null) {
        throw new Error('Please use the BackendProvider')
    }
    return context
}

const doRequest = async (config: Config): Promise<any> => {
    const apiUrl = `${config.url}/api/v4/groups/${config.group}/merge_requests`

    return request
        .get(apiUrl)
        .set('Private-Token', config.token)
        .query({ state: 'opened', order_by: 'updated_at', sort: 'asc' })
        .timeout(4000)
        .then(response => response.body)
}

export const BackendProvider = ({ ...props }) => {
    const { config } = useConfig()
    const [mergeRequests, setMergeRequests] = React.useState<MergeRequest[] | undefined>(undefined)
    const [loadErrors, setLoadErrors] = React.useState<number>(0)
    console.log('BackendProvider', config)

    const updateData = async (newConfig?: Config) => {
        try {
            const configToUse = newConfig || config
            if (configToUse) {
                const data = await doRequest(configToUse)
                setMergeRequests(data)
                setLoadErrors(0)
            }
        } catch (error) {
            console.error(error)
            setLoadErrors(loadErrors + 1)
            if (loadErrors > 2) {
                setMergeRequests(undefined)
            }
        }
    }

    React.useEffect(() => {
        console.log('useEffect')
        updateData()
        const interval = setInterval(updateData, 30000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    const testConfig = async (newConfig: Config) => {
        console.log('testConfig', newConfig)

        return doRequest(newConfig)
    }

    const reset = () => {
        console.log('reset backend')
        setLoadErrors(0)
        setMergeRequests(undefined)
    }

    return <Context.Provider value={{ mergeRequests, reset, testConfig }} {...props} />
}
