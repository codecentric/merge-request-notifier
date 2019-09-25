import { GroupedMergeRequest, MergeRequest, User } from './types'

const users: User[] = [
    {
        id: 1,
        name: 'Matthias',
        username: 'ruettenm',
        avatar_url: require('../images/matthias.jpg'),
    },
    {
        id: 2,
        name: 'Julian',
        username: 'jukempff',
        avatar_url: require('../images/julian.jpg'),
    },
]

let mrId = 0

const createMr = (title: string, projectId: number): MergeRequest => {
    mrId++

    return {
        id: mrId,
        iid: mrId,
        created_at: '2019-11-25 11:00:00',
        updated_at: '2019-11-25 11:00:00',
        project_id: 1,
        title,
        state: 'opened',
        target_branch: 'something',
        source_branch: 'something',
        upvotes: randomArrayEntry([0, 0, 0, 0, 0, 1, 3, 5]),
        downvotes: randomArrayEntry([0, 0, 0, 0, 0, 1, 3, 5]),
        author: randomArrayEntry(users),
        assignee: randomArrayEntry(users),
        source_project_id: projectId,
        work_in_progress: false,
        user_notes_count: randomArrayEntry([0, 0, 0, 0, 0, 1, 3, 5]),
        web_url: `https://www.google.de?q=mr-${mrId}`,
        pipeline_status: randomArrayEntry(['running', 'pending', 'success', 'failed']),
    }
}

function randomArrayEntry<T>(array: T[]): T {
    const max = array.length - 1
    const index = Math.round(Math.random() * max)

    return array[index]
}

const testData: GroupedMergeRequest[] = [
    {
        project: {
            id: 1,
            name: 'Merge Request Notifier',
            name_with_namespace: 'codecentric / Merge Request Notifier',
        },
        mergeRequests: [
            createMr('My amazing Merge Request', 1),
            createMr('An other fancy new feature', 1),
            createMr('Refactor ui components', 1),
            createMr('Fix Bug: The app is crashing after login', 1),
        ],
    },
    {
        project: {
            id: 2,
            name: 'Component Library',
            name_with_namespace: 'UX & I / Component Library',
        },
        mergeRequests: [
            createMr('New Button styles', 2),
            createMr('Implement Date Picker', 2),
            createMr('Fix Bug: Internet Explorer is not showning the SVGs icons properly', 2),
        ],
    },
    {
        project: {
            id: 3,
            name: 'Some other cool project',
            name_with_namespace: 'codecentric / Some other cool project',
        },
        mergeRequests: [createMr('Support Emojis 🚀', 3)],
    },
]

export default testData
