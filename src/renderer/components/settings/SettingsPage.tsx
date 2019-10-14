import * as React from 'react'
import useReactRouter from 'use-react-router'

import { Box, Heading, Button, Text, Flex } from 'rebass'

import { useBackend } from '../../hooks/backend'
import { useConfig } from '../../hooks/config'
import sleep from '../../util/sleep'
import { FormInput } from './FormInput'
import { PersonalAccessTokenInfo } from './PersonalAccessTokenInfo'

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

    return (
        <>
            <Box p={2}>
                <form autoComplete='off'>
                    {errors.invalidSettings && (
                        <Text p={1} color='white' bg='red'>
                            Could not load your merge requests. Please verify your settings.
                        </Text>
                    )}
                    <FormInput
                        error={errors.url}
                        label='GitLab Hostname'
                        id='url'
                        name='url'
                        type='url'
                        placeholder='https://gitlab.com'
                        value={values.url}
                        onChange={handleChange('url')}
                        disabled={submitting}
                        required
                    />

                    <FormInput
                        label='Personal Access Token'
                        id='token'
                        name='token'
                        type='text'
                        value={values.token}
                        onChange={handleChange('token')}
                        disabled={submitting}
                        required
                        error={errors.token ? 'red' : ''}
                        info={<PersonalAccessTokenInfo hostname={values.url} />}
                    />

                    <FormInput
                        label='GitLab Group Names'
                        id='group'
                        name='group'
                        type='text'
                        placeholder='my-first-group, another-group'
                        value={values.groups}
                        onChange={handleChange('groups')}
                        disabled={submitting}
                        error={errors.groups}
                        info={
                            <span>
                                Find it your projects URL:
                                <br />
                                <em>
                                    https://your-host.com/<strong>&lt;groupName&gt;</strong>/&lt;projectName&gt;
                                </em>
                                <br />
                                Separate multiple groups with a comma.
                            </span>
                        }
                        required
                    />

                    <Flex>
                        {!!config && (
                            <Button
                                mt={2}
                                mr={1}
                                sx={{ display: 'block', width: '100%' }}
                                variant='secondary'
                                aria-label='add'
                                disabled={submitting}
                                onClick={() => {
                                    history.push('/')
                                }}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button mt={2} ml={1} sx={{ display: 'block', width: '100%' }} variant='primary' aria-label='add' onClick={save} disabled={submitting}>
                            Save
                        </Button>
                    </Flex>
                </form>
            </Box>
            {!!config && !submitting && (
                <Box bg='lightred' px={2} pb={2} mt={3} sx={{ borderTop: '1px dashed', borderColor: 'red' }}>
                    <Heading my={3} fontSize={2} color='red'>
                        Danger zone
                    </Heading>
                    {confirmDelete ? (
                        <Button my={3} sx={{ display: 'block' }} variant='danger' onClick={remove}>
                            Are you sure?
                        </Button>
                    ) : (
                        <Button my={3} sx={{ display: 'block' }} variant='danger' onClick={confirmRemove}>
                            Remove Configuration
                        </Button>
                    )}
                </Box>
            )}
        </>
    )
}
