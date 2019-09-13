import * as React from 'react'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import CommentIcon from '@material-ui/icons/Comment'

import { Box, Image, Flex, Link, Text } from 'rebass'

type PipelineStatus = 'pending' | 'failure' | 'success'

interface MergeRequestItemStats {
    upVotes: number
    downVotes: number
    commentCount: number
    pipelineStatus?: PipelineStatus
}

interface MergeRequestItemProps {
    avatar: { alt: string; src?: string }
    title: string
    subTitle: string
    onClick: (evt: React.MouseEvent) => void
    stats: MergeRequestItemStats
}

const shouldRenderStats = ({ upVotes, downVotes, commentCount, pipelineStatus }: MergeRequestItemStats) =>
    upVotes > 0 || downVotes > 0 || commentCount > 0 || pipelineStatus !== undefined

const filterStats = ({ upVotes, downVotes, commentCount }: MergeRequestItemStats) =>
    [{ count: upVotes, Icon: ThumbUpIcon }, { count: downVotes, Icon: ThumbDownIcon }, { count: commentCount, Icon: CommentIcon }].filter(
        ({ count }) => count > 0,
    )

export const MergeRequestItem: React.FunctionComponent<MergeRequestItemProps> = ({ children, onClick, avatar, title, subTitle, stats }) => {
    const statsToRender = filterStats(stats)

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

                {shouldRenderStats(stats) && (
                    <Box
                        py={1}
                        px={2}
                        flex='0 0 auto'
                        sx={{ borderRadius: 4 }}
                        variant={stats.pipelineStatus ? `pipeline-${stats.pipelineStatus}` : 'no-pipeline'}
                    >
                        <Flex flex='0 0 auto' flexWrap='nowrap'>
                            {statsToRender.map(({ count, Icon }, index) => (
                                <Text fontSize={0} key={index}>
                                    {index > 0 && '|'}
                                    <Icon style={{ fontSize: '0.6rem' }} fontSize='small' />
                                    <Box as='span' pl={1}>
                                        {count}
                                    </Box>
                                </Text>
                            ))}
                        </Flex>
                    </Box>
                )}
            </Flex>
        </Link>
    )
}
