import * as React from 'react'
import { ipcRenderer } from 'electron'

import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'

import { Flex, Box, Link } from 'rebass'
import { Link as RouterLink } from 'react-router-dom'

const closeApp = () => {
    ipcRenderer.send('close-application')
}

export const Footer = () => (
    <Flex flexWrap='wrap' justifyContent='flex-end' bg='white' sx={{ overflow: 'hidden', borderTop: '1px solid', borderColor: 'shadow' }}>
        <RouterLink to='/config' title='Settings'>
            <Box p={2} color='gray' sx={{ ':hover': { color: 'black' } }}>
                <SettingsIcon fontSize='small' />
            </Box>
        </RouterLink>
        <Link variant='nav' as='button' color='gray' sx={{ ':hover': { color: 'black' } }} title='Close Application' onClick={closeApp}>
            <Box p={2}>
                <ExitToAppIcon fontSize='small' />
            </Box>
        </Link>
    </Flex>
)

// export const Header = () => (
//     <AppBar position='static' color='default'>
//         <Toolbar>
//             <img src={logo} className={classes.logo} />
//             <Typography variant='h5' color='inherit' className={classes.title}>
//                 Merge Request Notifier
//             </Typography>
//             <Link to='/config'>
//                 <IconButton title='Settings'>
//                     <SettingsIcon />
//                 </IconButton>
//             </Link>
//             <IconButton title='Close Application' onClick={closeApp}>
//                 <ExitToAppIcon />
//             </IconButton>
//         </Toolbar>
//     </AppBar>
// )
