import React from 'react'
import { ipcRenderer } from 'electron'
import { Flex, Box, Link } from 'rebass'
import { Link as RouterLink } from 'react-router-dom'

import InfoIcon from '@material-ui/icons/Info'
import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { LoadingIndicator } from '../util/LoadingIndicator'
import { useBackend } from '../../hooks/merge-requests/backend'

const closeApp: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault()
    ipcRenderer.send('close-application')
}

export const Footer: React.FunctionComponent = () => {
    const { isLoading } = useBackend()

    return (
        <Flex flexWrap='wrap' justifyContent='space-between' variant='barGradient' sx={{ overflow: 'hidden', borderTop: '1px solid', borderColor: 'shadow' }}>
            <Box py={1} flex='1 0 auto'>
                <LoadingIndicator visible={isLoading} title='Trying to fetch data' />
            </Box>
            <RouterLink to='/about-us' title='About Us'>
                <Box p={2} color='gray' sx={{ ':hover': { color: 'textColor' } }}>
                    <InfoIcon fontSize='small' />
                </Box>
            </RouterLink>
            <RouterLink to='/config' title='Settings'>
                <Box p={2} color='gray' sx={{ ':hover': { color: 'textColor' } }}>
                    <SettingsIcon fontSize='small' />
                </Box>
            </RouterLink>
            <Link variant='nav' as='button' color='gray' sx={{ ':hover': { color: 'textColor' } }} title='Close Application' onClick={closeApp}>
                <Box p={2}>
                    <ExitToAppIcon fontSize='small' />
                </Box>
            </Link>
        </Flex>
    )
}
