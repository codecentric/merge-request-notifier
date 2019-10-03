import * as React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import { Box } from 'rebass'

const MINIMUM_VISIBLE_MS = 600
const WIDTH = 38
const HEIGHT = 20
const DOT_GUTTER = 3
const DOT_COUNT = 3
const DOT_WIDTH = 4
const DOT_HEIGHT = DOT_WIDTH

const Svg: React.FunctionComponent<{ visible: boolean }> = styled.svg`
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    vertical-align: middle;
    transition: 0.3s opacity;
    opacity: ${({ visible }) => (visible ? 1 : 0)};
`

const circleAnimation = keyframes`
    0% {
        opacity: 0.5;
    }

    30% {
        opacity: 1;
    }

    60% {
        opacity: 0.5;
    }

    100% {
        opacity: 0.5;
    }
`

const Circle = styled.circle`
    animation: 1s ${circleAnimation} infinite both;
`

interface LoadingIndicatorProps {
    visible: boolean
    title: React.ReactNode
}

const dots = Array.from('.'.repeat(DOT_COUNT))

export const LoadingIndicator: React.FunctionComponent<LoadingIndicatorProps> = ({ visible, title }) => {
    const [usedVisible, setUsedVisible] = React.useState(visible)

    React.useEffect(() => {
        // This effect delays `visible` change from true to false by MINIM_VISIBLE_MS
        // and therefore ensures the loaders visiblity for at least the configured milliseconds
        let timeout: number
        const hide = () => {
            if (!visible) {
                setUsedVisible(false)
            }
        }

        const unmount = () => {
            if (timeout) {
                clearTimeout(timeout)
            }
        }

        if (visible) {
            setUsedVisible(visible)
        } else if (!visible && usedVisible) {
            timeout = setTimeout(hide, MINIMUM_VISIBLE_MS)
        }

        return unmount
    }, [visible])

    return (
        <Svg visible={usedVisible}>
            <title>{title}</title>
            {dots.map((nothing, index) => (
                <Box
                    key={`box-${index}`}
                    as={Circle}
                    sx={{
                        fill: 'black',
                        cx: `${DOT_GUTTER + DOT_WIDTH / 2 + (index + 1) * DOT_WIDTH + (index + 1) * DOT_GUTTER}px`,
                        cy: `${HEIGHT / 2 + DOT_HEIGHT / 2}px`,
                        r: `${DOT_WIDTH / 2}px`,
                        animationDelay: `${index * 130}ms`,
                    }}
                />
            ))}
        </Svg>
    )
}
