import * as React from 'react'
import { isValidHostname } from '../../util/isValidHostname'
import { shell } from 'electron'

interface PersonalAccessTokenInfoProps {
    hostname: string
}

const openProfileSettingsLink = (hostname: string): React.MouseEventHandler<HTMLAnchorElement> => event => {
    event.preventDefault()
    const url = `${hostname}${!hostname.endsWith('/') ? '/' : ''}profile/personal_access_tokens`

    shell.openExternal(url)
}

export const PersonalAccessTokenInfo: React.FunctionComponent<PersonalAccessTokenInfoProps> = ({ hostname }) => {
    if (isValidHostname(hostname)) {
        return (
            <span>
                Create one in your GitLab{' '}
                <a href='#' onClick={openProfileSettingsLink(hostname)}>
                    profile settings
                </a>
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
