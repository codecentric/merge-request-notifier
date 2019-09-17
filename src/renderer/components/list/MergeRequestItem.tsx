import * as React from 'react'
import { Box, Image, Flex, Link, Text } from 'rebass'

import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import CommentIcon from '@material-ui/icons/Comment'

import { PipelineStatus } from '../../hooks/types'
import { PipelineStatusIndicator } from './PipelineStatusIndicator'

interface MergeRequestItemStats {
    upVotes: number
    downVotes: number
    commentCount: number
    pipelineStatus?: PipelineStatus
}

interface MergeRequestItemProps {
    avatar: { alt: string; title: string; src?: string }
    title: string
    subTitle: string
    onClick: (evt: React.MouseEvent) => void
    stats: MergeRequestItemStats
}

interface RenderStats {
    count: number
    Icon: (props: any) => React.ReactElement
}

const filterStats = ({ upVotes, downVotes, commentCount }: MergeRequestItemStats): RenderStats[] =>
    [{ count: upVotes, Icon: ThumbUpIcon }, { count: downVotes, Icon: ThumbDownIcon }, { count: commentCount, Icon: CommentIcon }].filter(
        ({ count }) => count > 0,
    )

export const MergeRequestItem: React.FunctionComponent<MergeRequestItemProps> = ({ onClick, avatar, title, subTitle, stats }) => {
    const statsToRender = filterStats(stats).map(({ count, Icon }) => (
        <>
            <Icon style={{ fontSize: '0.6rem', verticalAlign: 'middle' }} fontSize='small' />
            <Box as='span' pl={1}>
                {count}
            </Box>
        </>
    ))

    if (stats.pipelineStatus) {
        statsToRender.push(<PipelineStatusIndicator status={stats.pipelineStatus} />)
    }

    return (
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

                {!!statsToRender.length && (
                    <Box p={1} flex='0 0 auto' sx={{ borderRadius: 4, background: 'transparent', color: 'black', border: '1px solid', borderColor: 'gray' }}>
                        <Flex flex='0 0 auto' flexWrap='nowrap'>
                            {statsToRender.map((content, index) => (
                                <Text fontSize={0} key={index}>
                                    {index > 0 && '|'}
                                    {content}
                                </Text>
                            ))}
                        </Flex>
                    </Box>
                )}
            </Flex>
        </Link>
    )
}
