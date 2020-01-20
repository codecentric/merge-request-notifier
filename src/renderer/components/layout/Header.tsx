import * as React from 'react'
import { Box, Flex, Text } from 'rebass'
import { Link, Route, Switch } from 'react-router-dom'

import ArrowIcon from '@material-ui/icons/ArrowBackSharp'

const BackLink = () => (
    <Box sx={{ position: 'absolute', left: 0, top: 0 }}>
        <Link to='/' title='Back'>
            <Box px={1} fontSize={1} color='gray' sx={{ width: 28, height: 24, ':hover': { color: 'textColor' } }}>
                <ArrowIcon fontSize='small' />
            </Box>
        </Link>
    </Box>
)

export const Header: React.FunctionComponent = () => {
    return (
        <Box p={2} variant='barGradient' sx={{ borderBottom: '1px solid', overflow: 'hidden', borderColor: 'shadow' }}>
            <Text textAlign='center' fontWeight='bold' fontSize={3}>
                <Switch>
                    <Route path='/config'>
                        <Flex sx={{ position: 'relative' }}>
                            <BackLink />
                            <Box flex='1 0 auto'>
                                <Text color='textColor'>Settings</Text>
                            </Box>
                        </Flex>
                    </Route>
                    <Route path='/update'>
                        <Flex sx={{ position: 'relative' }}>
                            <BackLink />
                            <Box flex='1 0 auto'>
                                <Text color='textColor'>Update Information</Text>
                            </Box>
                        </Flex>
                    </Route>
                    <Route path='/about-us'>
                        <Flex sx={{ position: 'relative' }}>
                            <BackLink />
                            <Box flex='1 0 auto'>
                                <Text color='textColor'>About us</Text>
                            </Box>
                        </Flex>
                    </Route>
                    <Route>
                        <Text color='textColor'>Merge Requests</Text>
                    </Route>
                </Switch>
            </Text>
        </Box>
    )
}
