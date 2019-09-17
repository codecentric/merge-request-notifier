import * as React from 'react'
import styled from '@emotion/styled'
import { /*keyframes, */ css } from '@emotion/core'
import { Box } from 'rebass'
import { PipelineStatus } from '../../hooks/types'

export interface PipelineStatusIndicatorProps {
    status: PipelineStatus
}

// See pendingPulse keyframes in app.scss
// emotion keyframes doesnt work in electron context
const svgAnimation = css`
    animation: pendingPipeline 2s linear infinite;
`

const Svg = styled.svg<{ animate?: boolean }>`
    width: 16px;
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
    <Svg animate={status === 'running'} viewBox='0 0 8px 16px' aria-title={`Pipeline status: "${status}"`}>
        <Box
            as='circle'
            sx={{
                cx: '8px',
                cy: '5px',
                r: '4px',
                ...colorFromStatusMap[status],
            }}
        />
    </Svg>
)
