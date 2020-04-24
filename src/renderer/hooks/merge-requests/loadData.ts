import * as request from 'superagent'
import * as log from 'electron-log'

import { Group, GroupedMergeRequest, MergeRequest, MergeRequestWithProject, Note, PipelineStatus, Project, UserNotesStatus } from './types'
import sleep from '../../util/sleep'
import { ConnectionConfig } from '../../../share/config'

const projectCache: { [id: number]: Project } = {}

const url = new URL(document.location.href)
const SHOW_TEST_DATA = url.searchParams.has('test-data')

if (SHOW_TEST_DATA) {
    log.info('Application is running in the "TEST MODE"')
}

export const loadGroups = async (connectionConfig: ConnectionConfig): Promise<Group[]> => {
    if (SHOW_TEST_DATA) {
        return sleep(500).then(() => [])
    }

    return Promise.all(
        connectionConfig.groups.map(async group => {
            const apiUrl = `${connectionConfig.url}/api/v4/groups/${group}`

            return request
                .get(apiUrl)
                .set('Private-Token', connectionConfig.token)
                .timeout(4000)
                .then(response => response.body)
        }),
    )
}

export interface Data {
    groupedMergeRequests: GroupedMergeRequest[]
    mergeRequestWithProjects: MergeRequestWithProject[]
}

export const loadData = async (connectionConfig: ConnectionConfig): Promise<Data> => {
    if (SHOW_TEST_DATA) {
        return sleep(500).then(() => require('./testData').default())
    }

    const mergeRequests = await loadMergeRequests(connectionConfig)

    const groupedMergeRequests = [] as GroupedMergeRequest[]
    const mergeRequestWithProjects = [] as MergeRequestWithProject[]
    for (const mergeRequest of mergeRequests) {
        const projectId = mergeRequest.work_in_progress ? -1 * mergeRequest.project_id : mergeRequest.project_id
        const mergeRequestId = mergeRequest.work_in_progress ? -1 * mergeRequest.id : mergeRequest.id
        let entry = groupedMergeRequests.find(group => group.project.id === projectId)
        if (!entry) {
            const project = await loadProject(connectionConfig, projectId)

            entry = { project, mergeRequests: [] }
            groupedMergeRequests.push(entry)
            mergeRequestWithProjects.push({
                ...mergeRequest,
                id: mergeRequestId,
                project,
            })
        } else {
            mergeRequestWithProjects.push({
                ...mergeRequest,
                project: entry.project,
            })
        }

        entry.mergeRequests.push(mergeRequest)
    }

    return {
        mergeRequestWithProjects,
        groupedMergeRequests: groupedMergeRequests.sort((a, b) => {
            // We use the project id multiplied with -1 for WIP MRs. They should be shown at the end
            const nameA = a.project.id > 0 ? a.project.name_with_namespace : `Z${a.project.name_with_namespace}`
            const nameB = b.project.id > 0 ? b.project.name_with_namespace : `Z${b.project.name_with_namespace}`

            return nameA.localeCompare(nameB)
        }),
    }
}

async function loadMergeRequestsFromProjects(connectionConfig: ConnectionConfig, group: string, projects: string[]): Promise<MergeRequest[]> {
    return ([] as MergeRequest[]).concat(
        ...(await Promise.all(
            projects.map(project => {
                const apiUrl = `${connectionConfig.url}/api/v4/projects/${encodeURIComponent(`${group}/${project}`)}/merge_requests`

                return request
                    .get(apiUrl)
                    .set('Private-Token', connectionConfig.token)
                    .query({ state: 'opened' })
                    .timeout(4000)
                    .then(response => response.body as MergeRequest[])
            }),
        )),
    )
}

async function loadMergeRequestsFromGroup(connectionConfig: ConnectionConfig, group: string): Promise<MergeRequest[]> {
    const apiUrl = `${connectionConfig.url}/api/v4/groups/${group}/merge_requests`

    return request
        .get(apiUrl)
        .set('Private-Token', connectionConfig.token)
        .query({ state: 'opened' })
        .timeout(4000)
        .then(response => response.body as MergeRequest[])
}

const loadMergeRequests = async (connectionConfig: ConnectionConfig): Promise<MergeRequest[]> => {
    return ([] as MergeRequest[]).concat(
        ...(await Promise.all(
            connectionConfig.groups.map(async group => {
                const mergeRequests =
                    connectionConfig.projects && connectionConfig.projects[group]?.length > 0
                        ? await loadMergeRequestsFromProjects(connectionConfig, group, connectionConfig.projects[group])
                        : await loadMergeRequestsFromGroup(connectionConfig, group)

                return Promise.all(
                    mergeRequests.map(async mergeRequest => {
                        return {
                            ...mergeRequest,
                            pipeline_status: await loadPipelineStatus(connectionConfig, mergeRequest.project_id, mergeRequest.iid),
                            user_notes: await loadUserNotes(connectionConfig, mergeRequest.project_id, mergeRequest.iid),
                        }
                    }),
                )
            }),
        )),
    )
}

const loadUserNotes = async (connectionConfig: ConnectionConfig, projectId: number, mergeRequestIid: number): Promise<UserNotesStatus> => {
    const apiUrl = `${connectionConfig.url}/api/v4/projects/${projectId}/merge_requests/${mergeRequestIid}/notes`

    const notes = await request
        .get(apiUrl)
        .set('Private-Token', connectionConfig.token)
        .timeout(4000)
        .then(res => res.body as Note[])

    const all = notes.filter(note => note.resolvable).length
    const resolved = notes.filter(note => note.resolved).length

    return {
        all,
        resolved,
    }
}

const loadPipelineStatus = async (connectionConfig: ConnectionConfig, projectId: number, mergeRequestIid: number): Promise<PipelineStatus | undefined> => {
    const apiUrl = `${connectionConfig.url}/api/v4/projects/${projectId}/merge_requests/${mergeRequestIid}/pipelines`

    const pipelines = await request
        .get(apiUrl)
        .set('Private-Token', connectionConfig.token)
        .query({ per_page: 1, page: 1 })
        .timeout(4000)
        .then(res => res.body)

    if (pipelines.length === 0) {
        return undefined
    }

    return pipelines[0].status
}

const loadProject = async (connectionConfig: ConnectionConfig, projectId: number): Promise<Project> => {
    const realProjectId = Math.abs(projectId)
    const apiUrl = `${connectionConfig.url}/api/v4/projects/${realProjectId}`

    if (projectCache[realProjectId]) {
        return applyOptionalWIPStatus(projectId, projectCache[realProjectId])
    }

    const project = await request
        .get(apiUrl)
        .set('Private-Token', connectionConfig.token)
        .timeout(4000)
        .then(res => res.body)

    projectCache[realProjectId] = project

    return applyOptionalWIPStatus(projectId, project)
}

const applyOptionalWIPStatus = (projectId: number, project: Project) => ({
    id: projectId,
    name: projectId > 0 ? project.name : `WIP / ${project.name}`,
    name_with_namespace: projectId > 0 ? project.name_with_namespace : `WIP / ${project.name_with_namespace}`,
})
