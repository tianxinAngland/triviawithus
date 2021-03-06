/* eslint-disable no-new */
import React from 'react'
import {connect} from 'react-redux'
import {resetQuestion, setSetup} from '../store'
import socket from '../socket'
import {Wait} from '.'
import {withStyles} from '@material-ui/core/styles'
import {TriviaHimHerVoteChart} from '.'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  CardMedia,
  Button
} from '@material-ui/core'

const styles = {
  root: {
    background: 'rgba(177, 175, 215, 0.6)',
    marginTop: '12vh',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    color: 'black',
    borderRadius: 3,
    justifyContent: 'flex-start',
    boxShadow: '0 3px 5px 2px',
    height: '76vh',
    margin: '10px'
  },
  buttonBar: {
    margin: '5px',
    flex: '0 0 3vh',
    display: 'flex',
    justifyContent: 'space-between'
  },
  media: {
    display: 'flex',
    flex: '5 2 40vh',
    justifyContent: 'center',
    marginBottom: '5vh'
  },
  body: {
    flex: '0 0 5vh'
  },
  voters: {display: 'flex', flexWrap: 'wrap', justifyContent: 'center'},
  voter: {width: '17vw', marginTop: '1vh', marginBottom: '1vh'}
}

class TriviaHimHerVote extends React.Component {
  render() {
    const NUM_QUESTIONS = 8
    const {classes} = this.props

    if (this.props.questions !== null && this.props.user.type === 'admin') {
      const toEmit = {
        ...this.props.question,
        displayType: 'vote',
        questionType: 'himher'
      }
      socket.emit('FromHost', toEmit)
    }
    const showEng = this.props.user.language === 'EN'

    return (
      <div>
        {this.props.question.id ? (
          <Card className={classes.root} variant="outlined">
            {this.props.user.type === 'admin' ? (
              <CardActions className={classes.buttonBar}>
                <Button
                  disabled={this.props.question.id === NUM_QUESTIONS}
                  size="small"
                  href={`/triviahimhers?id=${this.props.question.id +
                    1}&type=question`}
                >
                  Next Question!
                </Button>
                {this.props.question.id === NUM_QUESTIONS && (
                  <Button size="small" href="/triviahimhers?type=winner">
                    Winner?
                  </Button>
                )}
                <Button
                  size="small"
                  href="/triviahimhers?id=1&type=question"
                  onClick={() => {
                    this.props.resetQuestion()
                    socket.emit('ResetUserFromHost')
                  }}
                >
                  Restart!
                </Button>
              </CardActions>
            ) : (
              ''
            )}
            <CardContent className={classes.body}>
              <Typography variant="h4" component="h1" align="center">
                {showEng
                  ? `Question ${this.props.question.id}/${NUM_QUESTIONS}:`
                  : `问 ${this.props.question.id}/${NUM_QUESTIONS}:`}
              </Typography>
              <br />
              <Typography variant="h3" component="h3" align="center">
                {showEng
                  ? `${this.props.question.text}`
                  : `${this.props.question.text}`}
              </Typography>
              <br />
              <Typography variant="h4" component="h3" align="center">
                {this.props.userVoteInfo.length > 0
                  ? `Winners:`
                  : `No Winners!`}
              </Typography>
              {this.props.user.type === 'admin' && (
                <Typography
                  align="center"
                  className={classes.voters}
                  component="h4"
                >
                  {this.props.userVoteInfo.length > 0 &&
                    this.props.userVoteInfo.map(voter => (
                      <Typography
                        key={voter.id}
                        className={classes.voter}
                        component="p"
                        align="center"
                      >
                        {voter.nickname ? voter.nickname : voter.email}
                      </Typography>
                    ))}
                  <br />
                </Typography>
              )}
            </CardContent>
            <CardMedia className={classes.media}>
              <TriviaHimHerVoteChart question={this.props.question} />
            </CardMedia>
          </Card>
        ) : (
          <Wait from="loading" />
        )}
      </div>
    )
  }
}

const mapState = state => ({
  user: state.user,
  userVoteInfo: state.triviaHimHer.curQuestion.users
    ? state.triviaHimHer.curQuestion.users.filter(
        user => user.triviahimhervote.correct === true
      )
    : []
})
const mapDispatch = dispatch => ({
  resetQuestion: () => {
    dispatch(resetQuestion())
  },
  setSetup: question => {
    dispatch(setSetup(question))
  }
})

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(TriviaHimHerVote))
