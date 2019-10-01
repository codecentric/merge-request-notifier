import * as request from 'superagent'

import { Config } from './config'
import { Group, GroupedMergeRequest, MergeRequest, PipelineStatus, Project } from './types'

const projectCache: { [id: number]: Project } = {}

const url = new URL(document.location.href)
const TEST_MODE = url.searchParams.has('test')

const resolveAfterMs = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

if (TEST_MODE) {
    console.info('Application is running in the "TEST MODE"')
}

export const loadGroups = async (config: Config): Promise<Group[]> => {
    if (TEST_MODE) {
        return resolveAfterMs(500).then(() => [])
    }

    return Promise.all(
        config.groups.map(async group => {
            const apiUrl = `${config.url}/api/v4/groups/${group}`

            return request
                .get(apiUrl)
                .set('Private-Token', config.token)
                .timeout(4000)
                .then(response => response.body)
        }),
    )
}

export const loadData = async (config: Config): Promise<GroupedMergeRequest[]> => {
    if (TEST_MODE) {
        return resolveAfterMs(500).then(() => require('./testData').default)
    }

    const mergeRequests = await loadMergeRequests(config)

    const result = [] as GroupedMergeRequest[]
    for (const mergeRequest of mergeRequests) {
        const projectId = mergeRequest.work_in_progress ? -1 * mergeRequest.project_id : mergeRequest.project_id
        let entry = result.find(group => group.project.id === projectId)
        if (!entry) {
            const project = await loadProject(config, projectId)

            entry = { project, mergeRequests: [] }
            result.push(entry)
        }

        entry.mergeRequests.push(mergeRequest)
    }

    return result.sort((a, b) => {
        const nameA = a.project.id > 0 ? a.project.name_with_namespace : `Z${a.project.name_with_namespace}`
        const nameB = b.project.id > 0 ? b.project.name_with_namespace : `Z${b.project.name_with_namespace}`

        return nameA.localeCompare(nameB)
    })
}

const loadMergeRequests = async (config: Config): Promise<MergeRequest[]> => {
    return ([] as MergeRequest[]).concat(
        ...(await Promise.all(
            config.groups.map(async group => {
                const apiUrl = `${config.url}/api/v4/groups/${group}/merge_requests`

                const mergeRequests = await request
                    .get(apiUrl)
                    .set('Private-Token', config.token)
                    .query({ state: 'opened' })
                    .timeout(4000)
                    .then(response => response.body as MergeRequest[])

                return Promise.all(
                    mergeRequests.map(async mergeRequest => {
                        return {
                            ...mergeRequest,
                            pipeline_status: await loadPipelineStatus(config, mergeRequest.project_id, mergeRequest.iid),
                        }
                    }),
                )
            }),
        )),
    )
}

const loadPipelineStatus = async (config: Config, projectId: number, mergeRequestIid: number): Promise<PipelineStatus | undefined> => {
    const apiUrl = `${config.url}/api/v4/projects/${projectId}/merge_requests/${mergeRequestIid}/pipelines`

    const pipelines = await request
        .get(apiUrl)
        .set('Private-Token', config.token)
        .query({ per_page: 1, page: 1 })
        .timeout(4000)
        .then(res => res.body)

    if (pipelines.length === 0) {
        return undefined
    }

    return pipelines[0].status
}

const loadProject = async (config: Config, projectId: number): Promise<Project> => {
    const realProjectId = Math.abs(projectId)
    const apiUrl = `${config.url}/api/v4/projects/${realProjectId}`

    if (projectCache[realProjectId]) {
        return applyOptionalWIPStatus(projectId, projectCache[realProjectId])
    }

    const project = await request
        .get(apiUrl)
        .set('Private-Token', config.token)
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
