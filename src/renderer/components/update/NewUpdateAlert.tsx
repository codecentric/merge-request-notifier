import React from 'react'
import { Box, Flex, Link, Text } from 'rebass'
import { remote } from 'electron'
import compareVersions from 'compare-versions'

import { useUpdater } from '../../hooks/updater'
import { useHistory } from 'react-router'

export const NewUpdateAlert = () => {
    const currentVersion = remote.app.getVersion()
    const { updateInfo } = useUpdater()
    const history = useHistory()
    const showUpdateDetails = () => {
        history.push('/update')
    }

    if (!updateInfo || compareVersions(updateInfo.updateInfo.version, currentVersion) < 1) {
        return null
    }

    return (
        <Box py={1} px={2} sx={{ position: 'sticky', zIndex: 2, top: 0, borderBottom: '1px solid', borderColor: 'shadow' }} bg='siteBackground'>
            <Text fontWeight='bold' color='red' letterSpacing={1} sx={{ textTransform: 'uppercase' }} fontSize='12px' lineHeight={'25px'}>
                <Flex justifyContent='space-between'>
                    <Text>New update available 🎉</Text>
                    <Link href='#' onClick={showUpdateDetails} title='Update details' color='linkColor'>
                        Details
                    </Link>
                </Flex>
            </Text>
        </Box>
    )
}
