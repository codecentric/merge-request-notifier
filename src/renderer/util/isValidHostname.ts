const HOSTNAME_PATTERN = new RegExp(
    '^(https?://)?' + // protocol
    '((([a-zd]([a-zd-]*[a-zd])*).)+[a-z]{2,}|' + // domain name
    '((d{1,3}.){3}d{1,3}))' + // OR ip (v4) address
        '(:d+)?(/)*', // port
)

export function isValidHostname(hostname: string) {
    return HOSTNAME_PATTERN.test(hostname)
}
