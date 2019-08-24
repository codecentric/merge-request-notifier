import * as React from 'react'
import * as moment from 'moment'
import { ipcRenderer } from 'electron'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemText from '@material-ui/core/ListItemText'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Typography from '@material-ui/core/Typography'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Divider from '@material-ui/core/Divider'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { MergeRequest, useBackend } from '../hooks/useBackend'

const useStyles = makeStyles(theme => ({
    headline: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),
    },
    votes: {
        marginLeft: theme.spacing(0.5),
        marginTop: 4,
        fontSize: 18,
    },
    listItemText: {
        marginRight: theme.spacing(2),
    },
    list: {
        padding: 0,
    },
    upVoteIcon: {
        marginBottom: 5,
    },
    downVoteIcon: {
        marginTop: 5,
    },
}))

const renderMergeRequest = (classes: any) => (mergeRequest: MergeRequest, index: number) => {
    const time = moment(mergeRequest.updated_at).format('DD.MM. HH:mm')
    const downVotes = !!mergeRequest.downvotes && (
        <ListItemIcon>
            <>
                <ThumbDownIcon className={classes.downVoteIcon} /> <strong className={classes.votes}>{mergeRequest.downvotes}</strong>
            </>
        </ListItemIcon>
    )
    const upVotes = !!mergeRequest.upvotes && (
        <ListItemIcon>
            <>
                <ThumbUpIcon className={classes.upVoteIcon} /> <strong className={classes.votes}>{mergeRequest.upvotes}</strong>
            </>
        </ListItemIcon>
    )
    const assignee = !!mergeRequest.assignee && <span>, Assignee: {mergeRequest.assignee.name}</span>
    const secondaryText = (
        <>
            {time}
            {assignee}
        </>
    )

    return (
        <React.Fragment key={mergeRequest.id}>
            {index !== 0 && <Divider variant='inset' component='li' />}
            <ListItem button>
                <ListItemAvatar>
                    <Avatar alt={mergeRequest.author.name} src={mergeRequest.author.avatar_url} />
                </ListItemAvatar>
                <ListItemText id={`mr-${mergeRequest.id}`} primary={mergeRequest.title} secondary={secondaryText} className={classes.listItemText} />
                {upVotes}
                {downVotes}
            </ListItem>
        </React.Fragment>
    )
}

export const MergeRequests = () => {
    const classes = useStyles()
    const mergeRequests = useBackend()
    const wipMergeRequests = mergeRequests.filter(mergeRequest => mergeRequest.work_in_progress)
    const openMergeRequests = mergeRequests.filter(mergeRequest => !mergeRequest.work_in_progress)
    ipcRenderer.send('update-open-merge-requests', openMergeRequests.length)

    return (
        <>
            <Typography variant='h6' color='inherit' className={classes.headline}>
                Open
            </Typography>
            <List className={classes.list}>{openMergeRequests.map(renderMergeRequest(classes))}</List>
            <Typography variant='h6' color='inherit' className={classes.headline}>
                Work In Progress
            </Typography>
            <List className={classes.list}>{wipMergeRequests.map(renderMergeRequest(classes))}</List>
        </>
    )
}
