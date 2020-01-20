import * as React from 'react'
import { Box, Image, Flex, Link, Text } from 'rebass'

import { PipelineStatus } from '../../../hooks/merge-requests/types'
import { Stats } from './Stats'

interface MergeRequestItemStats {
    upVotes: number
    downVotes: number
    commentCount?: string
    pipelineStatus?: PipelineStatus
}

interface MergeRequestItemProps {
    avatar: { alt: string; title: string; src?: string }
    title: string
    subTitle: string
    onClick: (evt: React.MouseEvent) => void
    stats: MergeRequestItemStats
}

export const MergeRequestItem: React.FunctionComponent<MergeRequestItemProps> = ({ onClick, avatar, title, subTitle, stats }) => (
    <Link
        as='button'
        onClick={onClick}
        width={1}
        sx={{
            background: 'white',
            marginBottom: '1px',
            ':hover': {
                backgroundColor: 'lightgray',
            },
        }}
    >
        <Flex p={2} alignItems='center'>
            {avatar.src && (
                <Box mr={2} flex='0 0 auto'>
                    <Image variant='avatar' {...avatar} />
                </Box>
            )}
            <Box mr={2} flex='1 1 auto' sx={{}}>
                <Text color='black' fontSize={1} mb={1}>
                    {title}
                </Text>
                <Text sx={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} fontSize={0} color='gray'>
                    {subTitle}
                </Text>
            </Box>

            <Stats {...stats} />
        </Flex>
    </Link>
)
