import { hot } from 'react-hot-loader/root'
import * as React from 'react'
import { BrowserRouter, Link } from 'react-router-dom'

import { AppBar } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Settings from '@material-ui/icons/Settings'

import { ConfigProvider } from '../hooks/config'
import { Content } from './Content'

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow: 1,
    },
})

const Application = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <ConfigProvider>
                <BrowserRouter>
                    <AppBar position='static' color='default'>
                        <Toolbar>
                            <Typography variant='h5' color='inherit' className={classes.title}>
                                Merge Requests Notifier
                            </Typography>
                            <Link to='/config'>
                                <IconButton color='inherit'>
                                    <Settings />
                                </IconButton>
                            </Link>
                        </Toolbar>
                    </AppBar>
                    <Content />
                </BrowserRouter>
            </ConfigProvider>
        </div>
    )
}

export default hot(Application)
