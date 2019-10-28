import * as unhandled from 'electron-unhandled'
import { debugInfo, openNewGitHubIssue } from 'electron-util'

export function reportUnhandledRejections() {
    unhandled({
        reportButton: error => {
            openNewGitHubIssue({
                user: 'codecentric',
                repo: 'merge-request-notifier',
                body: `\`\`\`\n${error.stack}\n\`\`\`\n\n---\n\n${debugInfo()}`,
            })
        },
    })
}
