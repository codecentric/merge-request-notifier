const PATTERN = new RegExp(
    '^https?://' + // protocol is required
        '((([a-zd]([a-zd-]*[a-zd])*).)+[a-z]{2,}|' + // domain name
        '((d{1,3}.){3}d{1,3}))' + // OR ip (v4) address
        '(:d+)?(/)*', // port
)

export function isValidUrlWithProtocol(url: string) {
    return PATTERN.test(url)
}
