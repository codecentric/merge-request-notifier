import * as React from 'react'
import { Box, Flex, Text } from 'rebass'
import { Link } from 'react-router-dom'
import { remote } from 'electron'
import * as compareVersions from 'compare-versions'

import { useUpdater } from '../../hooks/updater'

export const NewUpdateAlert = () => {
    const currentVersion = remote.app.getVersion()
    const { updateInfo } = useUpdater()

    if (!updateInfo || compareVersions(updateInfo.updateInfo.version, currentVersion) < 1) {
        return null
    }

    return (
        <Box py={1} px={2} sx={{ position: 'sticky', zIndex: 2, top: 0, borderBottom: '1px solid', borderColor: 'shadow' }} bg='siteBackground'>
            <Text fontWeight='bold' color='red' letterSpacing={1} sx={{ textTransform: 'uppercase' }} fontSize='12px' lineHeight={'25px'}>
                <Flex justifyContent='space-between'>
                    <span>New update available 🎉</span>
                    <Link to='/update' title='Update details' style={{ color: '#000' }}>
                        Details
                    </Link>
                </Flex>
            </Text>
        </Box>
    )
}
