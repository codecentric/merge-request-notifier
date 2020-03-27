import * as React from 'react'
import { Box, Button, Flex, Text } from 'rebass'
import { useHistory } from 'react-router-dom'
import * as moment from 'moment'

import { useUpdater } from '../../hooks/updater'

export const UpdateInfoPage = () => {
    const history = useHistory()
    const { updateInfo, install } = useUpdater()
    const [installButtonDisabled, setInstallButtonDisabled] = React.useState(false)
    const [installButtonText, setInstallButtonText] = React.useState('Install & Restart')

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
        setInstallButtonDisabled(true)
        setInstallButtonText('Installing...')
        install()
    }

    const releaseDate = moment(updateInfo.updateInfo.releaseDate).format('DD.MM.YYYY HH:mm')
    const releaseNotes = typeof updateInfo.updateInfo.releaseNotes === 'string' ? updateInfo.updateInfo.releaseNotes : ''

    return (
        <Box p={2}>
            <Text mb='2' fontSize='14px' lineHeight='1.75'>
                Version: <strong>{updateInfo.updateInfo.version}</strong>
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
