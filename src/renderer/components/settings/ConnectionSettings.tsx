import * as React from 'react'
import { useHistory } from 'react-router'
import { Box, Button, Flex, Heading, Text } from 'rebass'
import { Label } from '@rebass/forms'
import VisibilityIcon from '@material-ui/icons/Visibility'
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'

import { PersonalAccessTokenInfo } from './PersonalAccessTokenInfo'
import { useBackend } from '../../hooks/merge-requests/backend'
import { useConfig } from '../../hooks/config'
import sleep from '../../util/sleep'
import { FormInput } from '../form/FormInput'
import { ProjectsConfig } from '../../../share/config'

interface FormErrorData {
    url: string
    groups: string
    invalidSettings: boolean
    token: string
}

interface ProjectsFormData {
    [group: string]: string
}
interface FormData {
    url: string
    groups: string
    projects: ProjectsFormData
    token: string
}

const splitStringByComma = (groups: string) => {
    return groups
        .split(',')
        .map(group => group.trim())
        .filter(group => !!group)
}

const URL_REQUIRED_ERROR_MESSAGE = 'Please enter your GitLab URL.'
const TOKEN_REQUIRED_ERROR_MESSAGE = 'Please enter your Personal Access Token.'
const GROUP_NAMES_REQUIRED_ERROR_MESSAGE = 'Please enter at least one Group Name'

const projectsFromConfig = (projectsConfig?: ProjectsConfig): ProjectsFormData => {
    return projectsConfig
        ? Object.keys(projectsConfig).reduce((previousValue, current) => {
              previousValue[current] = projectsConfig[current].join(', ')

              return previousValue
          }, {} as ProjectsFormData)
        : {}
}

// tslint:disable-next-line:cyclomatic-complexity
export const ConnectionSettings: React.FunctionComponent = () => {
    const history = useHistory()
    const { testConnectionConfig } = useBackend()
    const { config, updateConnectionConfig, removeConfig } = useConfig()

    const [accessKeyIconVisible, setAccessKeyIconVisible] = React.useState(false)
    const [confirmDelete, setConfirmDelete] = React.useState(false)
    const [splittedGroups, setSplittedGroups] = React.useState<string[]>(config?.connectionConfig?.groups || [])
    const [submitting, setSubmitting] = React.useState(false)
    const [errors, setErrors] = React.useState<FormErrorData>({
        url: '',
        token: '',
        groups: '',
        invalidSettings: false,
    })

    const [values, setValues] = React.useState<FormData>({
        url: config.connectionConfig?.url || '',
        token: config.connectionConfig?.token || '',
        groups: (config.connectionConfig?.groups || []).join(', '),
        projects: projectsFromConfig(config.connectionConfig?.projects),
    })

    const toggleAccessKeyIconVisibility: React.MouseEventHandler<HTMLDivElement> = event => {
        event.preventDefault()
        setAccessKeyIconVisible(!accessKeyIconVisible)
    }

    const setError = (name: keyof FormErrorData, errorMessage: string | boolean) => {
        setErrors({ ...errors, [name]: errorMessage })
    }

    const handleUrlBlur = () => {
        validateRequiredError('url', 'url', URL_REQUIRED_ERROR_MESSAGE)()
        if (values.url && !values.url.startsWith('http://') && !values.url.startsWith('https://')) {
            setError('url', 'Please start your URL with http(s)://')
        }
    }

    const handleGroupsBlur = () => {
        setSplittedGroups(splitStringByComma(values.groups))
        validateRequiredError('groups', 'groups', GROUP_NAMES_REQUIRED_ERROR_MESSAGE)()
    }

    const handleProjectsChange = (group: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, projects: { ...values.projects, [group]: event.target.value } })
    }

    const validateRequiredError = (valuesKey: keyof FormData, errorKey: keyof FormErrorData, errorMessage: string) => () => {
        if (!values[valuesKey]) {
            setError(errorKey, errorMessage)
        } else {
            setError(errorKey, '')
        }
    }

    const handleChange = (name: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [name]: event.target.value })
    }

    const confirmRemove: React.MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        setConfirmDelete(true)
    }

    const remove: React.MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        removeConfig()
        setErrors({ url: '', token: '', groups: '', invalidSettings: false })
        setValues({ url: '', token: '', groups: '', projects: {} })
    }

    const cancel: React.MouseEventHandler<HTMLButtonElement> = event => {
        event.preventDefault()
        history.push('/')
    }

    const save: React.MouseEventHandler<HTMLButtonElement> = async event => {
        event.preventDefault()
        setSubmitting(true)
        setErrors({ url: '', token: '', groups: '', invalidSettings: false })

        if (!values.url) {
            setError('url', URL_REQUIRED_ERROR_MESSAGE)
        }
        if (!values.token) {
            setError('token', TOKEN_REQUIRED_ERROR_MESSAGE)
        }
        if (!values.groups) {
            setError('groups', GROUP_NAMES_REQUIRED_ERROR_MESSAGE)
        }

        if (values.url && values.token && values.groups) {
            const projects = Object.keys(values.projects).reduce((previousValue, current) => {
                previousValue[current] = splitStringByComma(values.projects[current])

                return previousValue
            }, {} as ProjectsConfig)
            const newConnectionConfig = {
                url: values.url,
                token: values.token,
                groups: splitStringByComma(values.groups),
                projects,
            }

            const testResult = await testConnectionConfig(newConnectionConfig)
            if (testResult) {
                updateConnectionConfig(newConnectionConfig)

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
                    <FormInput
                        error={errors.url}
                        label='GitLab Url'
                        id='url'
                        name='url'
                        type='url'
                        placeholder='e.g. https://gitlab.com'
                        value={values.url}
                        onChange={handleChange('url')}
                        onBlur={handleUrlBlur}
                        disabled={submitting}
                        required
                    />

                    <Flex>
                        <Flex flexGrow={1}>
                            <FormInput
                                label='Personal Access Token'
                                id='token'
                                name='token'
                                type={accessKeyIconVisible ? 'text' : 'password'}
                                value={values.token}
                                onChange={handleChange('token')}
                                onBlur={validateRequiredError('token', 'token', TOKEN_REQUIRED_ERROR_MESSAGE)}
                                disabled={submitting}
                                required
                                error={errors.token}
                                info={<PersonalAccessTokenInfo hostname={values.url} />}
                            />
                        </Flex>
                        <Box
                            fontSize={1}
                            color='gray'
                            sx={{ marginTop: '27px', marginLeft: '7px', width: 20, height: 20, ':hover': { color: 'textColor' } }}
                            onClick={toggleAccessKeyIconVisibility}
                        >
                            {accessKeyIconVisible ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />}
                        </Box>
                    </Flex>

                    <FormInput
                        label='GitLab Group Names'
                        id='group'
                        name='group'
                        type='text'
                        placeholder='e.g. my-first-group, another-group'
                        value={values.groups}
                        onChange={handleChange('groups')}
                        onBlur={handleGroupsBlur}
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

                    <Label fontWeight='bold' fontSize={1} mb={1}>
                        Filter Projects (optional)
                    </Label>
                    <Text mt={1} mb={2} fontSize={1} lineHeight={1.4}>
                        <span>
                            By default you will see all merge requests of the given groups. If you are only interested in a few projects you can define them
                            here.
                            <br />
                            Separate multiple projects with a comma.
                        </span>
                    </Text>

                    {splittedGroups.map(splittedGroup => {
                        const key = `projects-${splittedGroup}`

                        return (
                            <FormInput
                                label={`Projects for Group "${splittedGroup}"`}
                                id={key}
                                key={key}
                                name={key}
                                indented={3}
                                type='text'
                                placeholder='e.g. my-awesome-project, another-project'
                                value={values.projects[splittedGroup] || ''}
                                onChange={handleProjectsChange(splittedGroup)}
                                disabled={submitting}
                            />
                        )
                    })}

                    {errors.invalidSettings && (
                        <Text p={1} color='lightBackground' bg='red' mb={3}>
                            Could not load your merge requests. Please verify your settings.
                        </Text>
                    )}

                    <Flex>
                        {!!config && (
                            <Button
                                mt={2}
                                mr={1}
                                sx={{ display: 'block', width: '100%' }}
                                variant='secondary'
                                aria-label='cancel'
                                disabled={submitting}
                                onClick={cancel}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button mt={2} ml={1} sx={{ display: 'block', width: '100%' }} variant='primary' aria-label='add' onClick={save} disabled={submitting}>
                            {submitting ? 'Testing and Saving...' : 'Save'}
                        </Button>
                    </Flex>
                </form>
            </Box>
            {!!config.connectionConfig && !submitting && (
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
