import * as React from 'react'
import useReactRouter from 'use-react-router'
import { Link } from 'react-router-dom'

import Container from '@material-ui/core/Container/Container'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button/Button'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { useBackend } from '../../hooks/backend'
import { useConfig } from '../../hooks/config'
import { FormHelperText } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
    button: {
        marginTop: theme.spacing(2),
    },
    goBackLink: {
        textDecoration: 'none',
    },
    headline: {
        marginTop: theme.spacing(2),
    },
}))

type FormErrorData = FormData & { invalidSettings: boolean }

interface FormData {
    url: string
    group: string
    token: string
}

export const SettingsPage = () => {
    const classes = useStyles()
    const { history } = useReactRouter()
    const { reset, testConfig } = useBackend()
    const { config, updateConfig } = useConfig()

    const [submitting, setSubmitting] = React.useState(false)
    const [errors, setErrors] = React.useState<FormErrorData>({
        url: '',
        token: '',
        group: '',
        invalidSettings: false,
    })
    const [values, setValues] = React.useState<FormData>({
        url: config ? config.url : '',
        token: config ? config.token : '',
        group: config ? config.group : '',
    })

    const setError = (name: keyof FormErrorData, errorMessage: string | boolean) => {
        setErrors({ ...errors, [name]: errorMessage })
    }

    const handleChange = (name: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const save = async () => {
        setSubmitting(true)
        setErrors({ url: '', token: '', group: '', invalidSettings: false })

        if (!values.url) {
            setError('url', 'Please enter your GitLab URL.')
        }
        if (!values.token) {
            setError('token', 'Please enter your Personal Access Token.')
        }
        if (!values.group) {
            setError('group', 'Please enter your Group Name')
        }

        if (values.url && values.token) {
            const newConfig = {
                url: values.url,
                token: values.token,
                group: values.group,
            }

            try {
                await testConfig(newConfig)

                updateConfig(newConfig)

                reset()
                history.push('/')
            } catch (_) {
                setError('invalidSettings', true)
            } finally {
                setSubmitting(false)
            }
        }
    }

    return (
        <Container>
            <Typography variant='h6' className={classes.headline}>
                Settings
            </Typography>
            <form autoComplete='off'>
                {errors.invalidSettings && <FormHelperText error>Could not load your merge requests. Please verify your settings.</FormHelperText>}
                <TextField
                    id='url'
                    label='GitLab URL'
                    placeholder='e.g. https://git.codecentric.de'
                    value={values.url}
                    error={!!errors.url}
                    helperText={errors.url}
                    onChange={handleChange('url')}
                    disabled={submitting}
                    required
                    fullWidth
                    margin='normal'
                />
                <TextField
                    id='group'
                    label='GitLab Group Name'
                    value={values.group}
                    error={!!errors.group}
                    helperText={errors.group || 'You find it in the url to your projects: <groupName>/<projectName>'}
                    onChange={handleChange('group')}
                    disabled={submitting}
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
                    disabled={submitting}
                    error={!!errors.token}
                    helperText={errors.token || 'You find it in GitLab under Profile > Settings > Access Tokens'}
                    required
                    fullWidth
                    margin='normal'
                />
                <Button variant='contained' color='primary' aria-label='add' fullWidth onClick={save} className={classes.button} disabled={submitting}>
                    Save
                </Button>
                {config && !submitting && (
                    <Link to='/' className={classes.goBackLink}>
                        <Button fullWidth className={classes.button}>
                            go back
                        </Button>
                    </Link>
                )}
            </form>
        </Container>
    )
}
