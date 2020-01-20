import * as React from 'react'
import { remote, shell } from 'electron'
import { Box, Link, Text } from 'rebass'

const openUrl = (url: string): React.MouseEventHandler<HTMLAnchorElement> => event => {
    event.preventDefault()
    shell.openExternal(url)
}

export const AboutUsPage = () => {
    const appVersion = remote.app.getVersion()

    return (
        <Box p={2}>
            <Text fontSize='14px' color='textColor'>
                This app was build because our team was searching for a tool to see the number of our current open merge requests and make them easily
                accessible. We didn't found such a tool and so we decided to build one by our own ;-)
            </Text>

            <Text mt={3} fontWeight='bold' color='textColor'>
                Thanks
            </Text>
            <Text fontSize='14px' color='textColor'>
                We want to thank our employers (
                <Link href='#' onClick={openUrl('https://codecentric.de')} color='linkColor'>
                    codecentric
                </Link>{' '}
                and{' '}
                <Link href='#' onClick={openUrl('https://uxi.de')} color='linkColor'>
                    UX&I
                </Link>
                ) to make it possible to develop this app in our +1 time.
            </Text>

            <Text mt={3} fontWeight='bold' color='textColor'>
                Issues / Feedback
            </Text>
            <Text fontSize='14px' color='textColor'>
                You found an issue or missed some feature? We are very keen about your feedback and appreciate any help. Please{' '}
                <Link href='#' onClick={openUrl('https://github.com/codecentric/merge-request-notifier/issues/new')} color='linkColor'>
                    create an issue
                </Link>{' '}
                on GitHub.
            </Text>

            <Text mt={3} textAlign='right' color='textColor'>
                <small>Version: {appVersion}</small>
            </Text>
        </Box>
    )
}
