import * as React from 'react'
import useReactRouter from 'use-react-router'
import { Link } from 'react-router-dom'

import Container from '@material-ui/core/Container/Container'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useConfig } from '../hooks/config'

const useStyles = makeStyles(theme => ({
    button: {
        marginTop: theme.spacing(2),
    },
    headline: {
        marginTop: theme.spacing(2),
    },
}))

interface FormData {
    url: string
    group: string
    token: string
}

export const SettingsPage = () => {
    const classes = useStyles()
    const { history } = useReactRouter()
    const { config, updateConfig } = useConfig()
    const [urlErrorMessage, setUrlErrorMessage] = React.useState('')
    const [tokenErrorMessage, setTokenErrorMessage] = React.useState('')
    const [groupErrorMessage, setGroupErrorMessage] = React.useState('')
    const [values, setValues] = React.useState<FormData>({
        url: config ? config.url : '',
        token: config ? config.token : '',
        group: config ? config.group : '',
    })

    const handleChange = (name: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const save = () => {
        if (!values.url) {
            setUrlErrorMessage('Please enter your GitLab URL.')
        }
        if (!values.token) {
            setTokenErrorMessage('Please enter your Personal Access Token.')
        }
        if (!values.group) {
            setGroupErrorMessage('Please enter your Group Name')
        }

        if (values.url && values.token) {
            updateConfig({
                url: values.url,
                token: values.token,
                group: values.group,
            })

            history.push('/')
        }
    }

    return (
        <Container>
            <Typography variant='h6' className={classes.headline}>
                Settings
            </Typography>
            <form autoComplete='off'>
                <TextField
                    id='url'
                    label='GitLab URL'
                    placeholder='e.g. https://git.codecentric.de'
                    value={values.url}
                    error={!!urlErrorMessage}
                    helperText={urlErrorMessage}
                    onChange={handleChange('url')}
                    required
                    fullWidth
                    margin='normal'
                />
                <TextField
                    id='group'
                    label='GitLab Group Name'
                    value={values.group}
                    error={!!groupErrorMessage}
                    helperText={groupErrorMessage || 'You find it in the url to your projects: <groupName>/<projectName>'}
                    onChange={handleChange('group')}
                    required
                    fullWidth
                    margin='normal'
                />
                <TextField
                    id='token'
                    label='Personal Access Token'
                    placeholder='e.g. abcdEFGHijklm'
                    value={values.token}
                    onChange={handleChange('token')}
                    error={!!tokenErrorMessage}
                    helperText={tokenErrorMessage || 'You find it in GitLab under Profile > Settings > Access Tokens'}
                    required
                    fullWidth
                    margin='normal'
                />
                <Button variant='contained' color='primary' aria-label='add' fullWidth onClick={save} className={classes.button}>
                    Save
                </Button>
                {config && (
                    <Link to='/'>
                        <Button fullWidth className={classes.button}>
                            go back
                        </Button>
                    </Link>
                )}
            </form>
        </Container>
    )
}
