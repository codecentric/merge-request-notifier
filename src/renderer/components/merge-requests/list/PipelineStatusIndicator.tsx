import React from 'react'
import styled from '@emotion/styled'
import { keyframes, css } from '@emotion/core'
import { Box } from 'rebass'
import { PipelineStatus } from '../../../hooks/merge-requests/types'

export interface PipelineStatusIndicatorProps {
    status: PipelineStatus
}

const runningKeyframes = keyframes`
    100% {
        transform: rotate(360deg);
    }
`

const svgAnimation = css`
    animation: ${runningKeyframes} 2s linear infinite;
`

const Svg = styled.svg<{ animate?: boolean }>`
    width: 10px;
    height: 10px;
    vertical-align: middle;

    ${({ animate }) => animate && svgAnimation}
`

const colorFromStatusMap: { [K in PipelineStatus]: any } = {
    running: { stroke: 'blue', strokeWidth: 2, strokeLinecap: 'round', strokeDasharray: '19, 20', strokeDashoffset: 0, fill: 'transparent' },
    pending: { fill: 'orange' },
    success: { fill: 'green' },
    failed: { fill: 'red' },
}

export const PipelineStatusIndicator: React.FunctionComponent<PipelineStatusIndicatorProps> = ({ status }) => (
    <Svg animate={status === 'running'}>
        <title>{`Pipeline status: "${status}"`}</title>
        <Box
            as='circle'
            sx={{
                cx: '5px',
                cy: '5px',
                r: '4px',
                ...colorFromStatusMap[status],
            }}
        />
    </Svg>
)
