import { remote, shell } from 'electron'
import * as React from 'react'
import { Box, Text } from 'rebass'

const createIssue: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault()
    shell.openExternal('https://github.com/codecentric/merge-request-notifier/issues/new')
}

export const AboutUsPage = () => {
    const appVersion = remote.app.getVersion()

    return (
        <Box p={2}>
            <Text>
                This app was build because our team was searching for a tool to see the number of our current open merge requests and make them easily
                accessible. We didn't found such a tool and so we decided to build one by our own ;-)
            </Text>

            <Text mt={3} fontWeight='bold'>
                Issues / Feedback
            </Text>
            <Text>
                You found an issue or missed some feature? We are very keen about your feedback and appreciate any help. Please{' '}
                <a href='#' onClick={createIssue}>
                    create an issue
                </a>{' '}
                on GitHub.
            </Text>

            <Text mt={3} textAlign='right'>
                <small>Version: {appVersion}</small>
            </Text>
        </Box>
    )
}
