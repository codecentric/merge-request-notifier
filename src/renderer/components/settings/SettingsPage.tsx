import * as React from 'react'
import useReactRouter from 'use-react-router'
import { Link } from 'react-router-dom'
import { Box, Heading, Button, Text } from 'rebass'
import { Label, Input } from '@rebass/forms'

import { useBackend } from '../../hooks/backend'
import { useConfig } from '../../hooks/config'
import sleep from '../../util/sleep'

type FormErrorData = FormData & { invalidSettings: boolean }

interface FormData {
    url: string
    groups: string
    token: string
}

// tslint:disable-next-line:cyclomatic-complexity
export const SettingsPage: React.FunctionComponent = () => {
    const { history } = useReactRouter()
    const { testConfig } = useBackend()
    const { config, updateConfig, removeConfig } = useConfig()

    const [confirmDelete, setConfirmDelete] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)
    const [errors, setErrors] = React.useState<FormErrorData>({
        url: '',
        token: '',
        groups: '',
        invalidSettings: false,
    })
    const [values, setValues] = React.useState<FormData>({
        url: config ? config.url : '',
        token: config ? config.token : '',
        groups: config ? (config.groups || []).join(', ') : '',
    })

    const setError = (name: keyof FormErrorData, errorMessage: string | boolean) => {
        setErrors({ ...errors, [name]: errorMessage })
    }

    const handleChange = (name: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const confirmRemove = async () => {
        setConfirmDelete(true)
    }

    const remove = async () => {
        removeConfig()
        setErrors({ url: '', token: '', groups: '', invalidSettings: false })
        setValues({ url: '', token: '', groups: '' })
    }

    const save = async () => {
        setSubmitting(true)
        setErrors({ url: '', token: '', groups: '', invalidSettings: false })

        if (!values.url) {
            setError('url', 'Please enter your GitLab URL.')
        }
        if (!values.token) {
            setError('token', 'Please enter your Personal Access Token.')
        }
        if (!values.groups) {
            setError('groups', 'Please enter at least one Group Name')
        }

        if (values.url && values.token && values.groups) {
            const newConfig = {
                url: values.url,
                token: values.token,
                groups: values.groups.split(',').map(group => group.trim()),
            }

            const testResult = await testConfig(newConfig)
            if (testResult) {
                updateConfig(newConfig)

                await sleep(1000)
                history.push('/')
            } else {
                setError('invalidSettings', true)
            }
        }

        setSubmitting(false)
    }

    const renderRemoveButton = () => {
        return confirmDelete ? (
            <Button mx='auto' my={3} sx={{ display: 'block' }} variant='secondary' onClick={remove}>
                Are you sure?
            </Button>
        ) : (
            <Button mx='auto' my={3} sx={{ display: 'block' }} variant='outline' onClick={confirmRemove}>
                remove config
            </Button>
        )
    }

    return (
        <Box p={2}>
            <Heading fontSize={2}>Settings</Heading>
            <form autoComplete='off'>
                {errors.invalidSettings && <Text color='red'>Could not load your merge requests. Please verify your settings.</Text>}
                <Box my={2}>
                    <Label htmlFor='url'>GitLab URL</Label>
                    <Input
                        id='url'
                        name='url'
                        type='url'
                        placeholder='https://gitlab.com'
                        value={values.url}
                        onChange={handleChange('url')}
                        disabled={submitting}
                        required
                    />
                    {!!errors.url && <Text color='red'>{errors.url}</Text>}
                </Box>

                <Box my={2}>
                    <Label htmlFor='group'>GitLab Group Names</Label>
                    <Input
                        id='group'
                        name='group'
                        type='text'
                        placeholder='my-first-group, another-group'
                        value={values.groups}
                        onChange={handleChange('groups')}
                        disabled={submitting}
                        required
                    />
                    <Text color={errors.groups ? 'red' : ''}>
                        {errors.groups || 'You find it in the url to your projects: <groupName>/<projectName>. Separate multiple groups with a comma.'}
                    </Text>
                </Box>

                <Box my={2}>
                    <Label htmlFor='token'>Personal Access Token</Label>
                    <Input id='token' name='token' type='text' value={values.token} onChange={handleChange('token')} disabled={submitting} required />
                    <Text color={errors.token ? 'red' : ''}>
                        {errors.token || 'You find it in GitLab under Profile > Settings > Access Tokens (it requires API scope)'}
                    </Text>
                </Box>

                <Button mt={4} sx={{ display: 'block', width: '100%' }} variant='primary' aria-label='add' onClick={save} disabled={submitting}>
                    Save
                </Button>
                {config && !submitting && renderRemoveButton()}
                <Box my={3}>
                    <Text textAlign='center'>{config && !submitting && <Link to='/'>go back</Link>}</Text>
                </Box>
            </form>
        </Box>
    )
}
