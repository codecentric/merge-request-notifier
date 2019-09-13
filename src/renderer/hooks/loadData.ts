import * as request from 'superagent'

import { Config } from './config'
import { GroupedMergeRequest, MergeRequest, Project } from './types'

export const loadData = async (config: Config): Promise<GroupedMergeRequest[]> => {
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

const loadProject = async (config: Config, projectId: number): Promise<Project> => {
    const apiUrl = `${config.url}/api/v4/projects/${Math.abs(projectId)}`

    const project = await request
        .get(apiUrl)
        .set('Private-Token', config.token)
        .timeout(4000)
        .then(response => response.body)

    return {
        id: projectId,
        name: projectId > 0 ? project.name : `WIP / ${project.name}`,
        name_with_namespace: projectId > 0 ? project.name_with_namespace : `WIP / ${project.name_with_namespace}`,
    }
}

const loadMergeRequests = (config: Config): Promise<MergeRequest[]> => {
    const apiUrl = `${config.url}/api/v4/groups/${config.group}/merge_requests`

    return request
        .get(apiUrl)
        .set('Private-Token', config.token)
        .query({ state: 'opened' })
        .timeout(4000)
        .then(response => response.body)
}
