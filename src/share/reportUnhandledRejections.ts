import unhandled from 'electron-unhandled'
import newGithubIssueUrl from 'new-github-issue-url'
import { shell } from 'electron'

export function reportUnhandledRejections() {
    unhandled({
        reportButton: async error => {
            await shell.openExternal(
                newGithubIssueUrl({
                    user: 'codecentric',
                    repo: 'merge-request-notifier',
                    body: `Error: ${error.message}\n\n---\n\n\`\`\`\n${error.stack}\n\`\`\``,
                }),
            )
        },
    })
}
