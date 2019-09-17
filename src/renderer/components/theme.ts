export const theme = {
    breakpoints: ['40em', '52em', '64em'],
    fontSizes: [12, 14, 16, 24],
    colors: {
        siteBackground: '#f5f5f5',
        blue: '#192CFD',
        black: '#212121',
        blackTinted: '#6d6d66',
        primary: '#192CFD',
        gray: '#a7a7aa',
        lightgray: '#f6f6ff',
        shadow: '#d2d2da',
        green: '#1fad56',
        red: '#FC3D53',
    },
    space: [0, 4, 8, 16, 32, 64, 128, 256],
    fonts: {
        body: 'IBM Plex Mono',
        heading: 'inherit',
        monospace: 'IBM Plex Mono',
    },
    fontWeights: {
        body: 400,
        heading: 700,
        bold: 700,
    },
    lineHeights: {
        body: 1.5,
        heading: 1.25,
    },
    shadows: {
        small: '0 0 4px rgba(0, 0, 0, .125)',
        large: '0 0 24px rgba(0, 0, 0, .125)',
    },
    variants: {
        avatar: {
            borderRadius: '50%',
            width: '2.25rem',
            height: '2.25rem',
        },
    },
    text: {
        uppercase: {
            textTransform: 'uppercase',
        },
    },
    buttons: {
        primary: {
            background: 'primary',
            color: 'white',
        },
        secondary: {
            background: 'lightgray',
            color: 'black',
        },
        outline: {
            border: '2px solid',
            borderColor: 'primary',
            background: 'white',
            color: 'black',
        },
    },
}
