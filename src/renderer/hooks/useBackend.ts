import { useEffect, useState } from 'react'
import * as request from 'superagent'

import { useConfig } from './config'

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

export const useBackend = () => {
    const { config } = useConfig()
    const [mergeRequests, setMergeRequests] = useState<MergeRequest[]>([])

    const updateData = async () => {
        try {
            if (config) {
                const apiUrl = `${config.url}/api/v4/groups/${config.group}/merge_requests`
                const response = await request
                    .get(apiUrl)
                    .set('Private-Token', config.token)
                    .query({ state: 'opened', order_by: 'updated_at', sort: 'asc' })
                setMergeRequests(response.body)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        updateData()
        const interval = setInterval(updateData, 30000)

        return () => {
            clearInterval(interval)
        }
    }, [])

    return mergeRequests
}
