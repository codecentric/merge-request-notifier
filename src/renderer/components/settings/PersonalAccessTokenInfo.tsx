import React from 'react'
import { isValidUrlWithProtocol } from '../../util/isValidUrlWithProtocol'
import { shell } from 'electron'
import { Link } from 'rebass'

interface PersonalAccessTokenInfoProps {
    hostname: string
}

const openProfileSettingsLink = (hostname: string): React.MouseEventHandler<HTMLAnchorElement> => event => {
    event.preventDefault()
    const url = `${hostname}${!hostname.endsWith('/') ? '/' : ''}profile/personal_access_tokens`

    shell.openExternal(url)
}

export const PersonalAccessTokenInfo: React.FunctionComponent<PersonalAccessTokenInfoProps> = ({ hostname }) => {
    if (isValidUrlWithProtocol(hostname)) {
        return (
            <span>
                Create one in your GitLab{' '}
                <Link href='#' onClick={openProfileSettingsLink(hostname)} color='linkColor'>
                    profile settings
                </Link>
                .
                <br />
                It requires <strong>API scope</strong>.
            </span>
        )
    }

    return (
        <span>
            Create one in your GitLab profile settings.
            <br />
            It requires <strong>API scope</strong>.
        </span>
    )
}
