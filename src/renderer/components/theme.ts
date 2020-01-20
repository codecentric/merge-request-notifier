export const theme = {
    breakpoints: ['40em', '52em', '64em'],
    fontSizes: [10, 12, 14, 16, 24],
    colors: {
        // lightBackground: '#515454', // white // #ffffff
        // defaultBackground: '#383634', // #f5f5f5
        // siteBackground: '#383634',
        // gray: '#a7a7aa', // can leave like this
        // lightgray: '#f6f6ff',
        defaultBackground: '#555555', // #f5f5f5
        siteBackground: '#555555',
        lightBackground: '#676767', // white // #ffffff
        lightgray: '#848484',
        gray: '#B3B3B3', // can leave like this

        shadow: '#d2d2da',

        black: '#212121',
        blackTinted: '#6d6d66',
        textColor: '#e8e9e9',
        textColorTinted: '#c1c5c8',

        blue: '#192CFD',
        primary: '#192CFD',
        primaryDarkened: '#091CED',
        green: '#1fad56',
        red: '#FC3D53',
        lightred: '#ffeaea',
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
        barGradient: {
            backgroundColor: 'lightBackground',
            backgroundImage: 'linear-gradient(lightBackground, #d2d2da4f)',
        },
    },
    text: {
        uppercase: {
            textTransform: 'uppercase',
        },
    },
    buttons: {
        primary: {
            backgroundColor: 'primary',
            color: 'lightBackground',
            fontWeight: 'bold',
            fontSize: 1,
            ':hover': {
                backgroundColor: 'primaryDarkened',
            },
            ':focus': {
                textDecoration: 'underline',
            },
        },
        secondary: {
            backgroundColor: 'lightgray',
            border: '1px solid',
            borderColor: 'gray',
            color: 'black',
            fontSize: 1,
            ':hover': {
                backgroundColor: 'lightBackground',
            },
            ':focus': {
                textDecoration: 'underline',
            },
        },
        danger: {
            backgroundColor: 'red',
            color: 'lightBackground',
            fontWeight: 'bold',
            fontSize: 1,
        },
    },
}
