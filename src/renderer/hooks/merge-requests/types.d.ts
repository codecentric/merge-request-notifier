export interface GroupedMergeRequest {
    project: Project
    mergeRequests: MergeRequest[]
}

export interface MergeRequestWithProject extends MergeRequest {
    project: Project
}

export interface User {
    id: number
    name: string
    username: string
    avatar_url?: string
}

export type PipelineStatus = 'running' | 'pending' | 'success' | 'failed'

export interface UserNotesStatus {
    all: number
    resolved: number
}

export interface Group {
    id: number
    name: string
    path: string
    description: string
    visibility: 'private' | 'internal' | 'public'
}

export interface Note {
    id: number
    noteable_id: number
    noteable_iid: number
    type: null
    author: User
    resolvable: boolean
    resolved?: boolean
    resolved_by?: User
}

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
    web_url: string
    user_notes: UserNotesStatus
    pipeline_status?: PipelineStatus
}

export interface Project {
    id: number
    name: string
    name_with_namespace: string
}
