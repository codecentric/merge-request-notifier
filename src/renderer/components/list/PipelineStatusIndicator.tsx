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
const pulsateCSS = css`
    animation: pendingPulse 2s infinite;
`

const Svg = styled.svg<{ pulsate?: boolean }>`
    width: 16px;
    height: 8px;

    ${({ pulsate }) => pulsate && pulsateCSS}
`

const colorFromStatusMap: { [K in PipelineStatus]: string } = {
    running: 'blue',
    pending: 'orange',
    success: 'green',
    failed: 'red',
}

export const PipelineStatusIndicator: React.FunctionComponent<PipelineStatusIndicatorProps> = ({ status }) => (
    <Svg pulsate={status === 'running'} viewBox='0 0 8px 16px' aria-title={`Pipeline status: "${status}"`}>
        <Box
            as='circle'
            sx={{
                fill: colorFromStatusMap[status],
                cx: '8px',
                cy: '4px',
                r: '4px',
            }}
        />
    </Svg>
)
