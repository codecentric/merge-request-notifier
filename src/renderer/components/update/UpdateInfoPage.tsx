import React from 'react'
import { Box, Button, Flex, Text } from 'rebass'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

import { useUpdater } from '../../hooks/updater'
import { remote, shell } from 'electron'

export const UpdateInfoPage = () => {
    const history = useHistory()
    const { updateInfo, install } = useUpdater()
    const [installButtonDisabled, setInstallButtonDisabled] = React.useState(false)
    const [installButtonText, setInstallButtonText] = React.useState(remote.process.platform === 'darwin' ? 'Install & Restart' : 'Download')

    if (!updateInfo) {
        return (
            <Box p={2}>
                <Text>There is currently no update available</Text>
            </Box>
        )
    }

    const cancel: React.MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        history.push('/')
    }
    const installUpdate: React.MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        if (remote.process.platform === 'darwin') {
            setInstallButtonDisabled(true)
            setInstallButtonText('Installing...')
            install()
        } else {
            shell.openExternal(`https://github.com/codecentric/merge-request-notifier/releases/tag/${updateInfo.version}`)
        }
    }

    const releaseDate = moment(updateInfo.releaseDate).format('DD.MM.YYYY HH:mm')
    const releaseNotes = typeof updateInfo.releaseNotes === 'string' ? updateInfo.releaseNotes : ''

    return (
        <Box p={2}>
            <Text mb='2' fontSize='14px' lineHeight='1.75'>
                Version: <strong>{updateInfo.version}</strong>
                <br />
                Release date: <strong>{releaseDate}</strong>
            </Text>
            <hr />
            <Text
                mt='2'
                fontSize='14px'
                className='release-notes'
                dangerouslySetInnerHTML={{
                    __html: releaseNotes,
                }}
            />
            <Flex mt={3}>
                <Button mr={1} sx={{ display: 'block', width: '100%' }} variant='secondary' aria-label='cancel' onClick={cancel}>
                    Cancel
                </Button>
                <Button
                    sx={{ display: 'block', width: '100%' }}
                    disabled={installButtonDisabled}
                    variant='primary'
                    aria-label='install update'
                    onClick={installUpdate}
                >
                    {installButtonText}
                </Button>
            </Flex>
        </Box>
    )
}
