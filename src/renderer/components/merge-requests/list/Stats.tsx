import * as React from 'react'
import { Box, Flex, Text } from 'rebass'

import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import CommentIcon from '@material-ui/icons/Comment'

import { PipelineStatus } from '../../../hooks/merge-requests/types'
import { PipelineStatusIndicator } from './PipelineStatusIndicator'

export interface StatsProps {
    upVotes: number
    downVotes: number
    commentCount?: string
    pipelineStatus?: PipelineStatus
}

export const Stats: React.FunctionComponent<StatsProps> = ({ upVotes, downVotes, commentCount, pipelineStatus }) => {
    const statsToRender = [
        { count: upVotes, Icon: ThumbUpIcon },
        { count: downVotes, Icon: ThumbDownIcon },
        { count: commentCount, Icon: CommentIcon },
    ]
        .filter(({ count }) => count)
        .map(({ count, Icon }) => (
            <>
                <Icon style={{ fontSize: '0.6rem', verticalAlign: 'middle' }} fontSize='small' />
                <Box as='span' pl={1}>
                    {count}
                </Box>
            </>
        ))

    if (pipelineStatus) {
        statsToRender.push(<PipelineStatusIndicator status={pipelineStatus} />)
    }

    if (statsToRender.length === 0) {
        return null
    }

    return (
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
    )
}
