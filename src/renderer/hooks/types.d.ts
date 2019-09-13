export interface GroupedMergeRequest {
    project: Project
    mergeRequests: MergeRequest[]
}

export interface User {
    id: number
    name: string
    username: string
    avatar_url?: string
}

export type PipelineStatus = 'running' | 'pending' | 'success' | 'failed'

export interface MergeRequest {
    id: number
    iid: number
    created_at: string
    updated_at: string
    project_id: number
    title: string
    state: 'opened' | 'closed' | 'locked' | 'merged'
    target_branch: string
    source_branch: string
    upvotes: number
    downvotes: number
    author: User
    assignee?: User
    source_project_id: number
    work_in_progress: boolean
    user_notes_count: number
    web_url: string
    pipeline_status?: PipelineStatus
}

export interface Project {
    id: number
    name: string
    name_with_namespace: string
}
