import * as request from 'superagent'

import { Config } from './config'
import { GroupedMergeRequest, MergeRequest, Project } from './types'

export const loadData = async (config: Config): Promise<GroupedMergeRequest[]> => {
    const mergeRequests = await loadMergeRequests(config)

    const result = [] as GroupedMergeRequest[]
    for (const mergeRequest of mergeRequests) {
        let entry = result.find(group => group.project.id === mergeRequest.project_id)
        if (!entry) {
            const project = await loadProject(config, mergeRequest.project_id)

            entry = { project, mergeRequests: [] }
            result.push(entry)
        }

        entry.mergeRequests.push(mergeRequest)
    }

    return result
}

const loadProject = async (config: Config, projectId: number): Promise<Project> => {
    const apiUrl = `${config.url}/api/v4/projects/${projectId}`

    return request
        .get(apiUrl)
        .set('Private-Token', config.token)
        .timeout(4000)
        .then(response => response.body)
}

const loadMergeRequests = (config: Config): Promise<MergeRequest[]> => {
    const apiUrl = `${config.url}/api/v4/groups/${config.group}/merge_requests`

    return request
        .get(apiUrl)
        .set('Private-Token', config.token)
        .query({ state: 'opened', order_by: 'updated_at', sort: 'asc' })
        .timeout(4000)
        .then(response => response.body)
}
