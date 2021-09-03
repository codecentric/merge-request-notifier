import React from 'react'
import { shell } from 'electron'
import { Link } from 'rebass'

const openHelpPage = (): React.MouseEventHandler<HTMLAnchorElement> => event => {
    event.preventDefault()
    const url = `https://www.electronjs.org/docs/api/accelerator`

    shell.openExternal(url)
}

export const ShortcutInfo: React.FunctionComponent = () => {
    return (
        <span>
            All possible shortcut values can be found in the{' '}
            <Link href='#' onClick={openHelpPage()} color='linkColor'>
                electron documentation
            </Link>
            .
        </span>
    )
}
