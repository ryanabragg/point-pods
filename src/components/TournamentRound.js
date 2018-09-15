import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import GroupWorkIcon from '@material-ui/icons/GroupWork';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';

import MenuButton from '../components/MenuButton';

const styles = theme => ({
  ctaStart: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
  unmargined: {
    margin: 0,
    padding: 0,
  },
  margined: {
    margin: theme.spacing.unit,
  },
  marginedLeft: {
    marginLeft: theme.spacing.unit,
  },
  menuButtonPaper: {
    maxHeight: theme.spacing.unit * 6 * 5.5,
    overflow: 'auto',
  },
  flex: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  right: {
    marginLeft: 'auto',
  },
  error: {
    color: theme.palette.error.contrastText,
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
  },
  scoreField: {
    maxWidth: 7 * theme.spacing.unit,
  },
  printPod: {
    width: '90%',
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    padding: 2 * theme.spacing.unit,
    borderTop: '1px dashed',
    pageBreakInside: 'avoid',
  },
  printPodEntry: {
    height: 3 * theme.spacing.unit,
    width: 8 * theme.spacing.unit,
    borderBottom: '1px solid',
  },
  hideOnPrint: {
    '@media print': {
      display: 'none',
    },
  },
  showOnPrint: {
    display: 'none',
    '@media print': {
      display: 'block',
    },
  },
});

class TournamentRounds extends Component {
  scores = [];

  componentWillUnmount() {
    if(this.timeout)
      clearTimeout(this.timeout);
    this.timeout = null;
    this.props.sync(false);
  }

  updateScores = () => {
    this.props.onUpdateScores(this.scores);
    this.scores = [];
  };

  handleScorePlayer = id => event => {
    const points = Number(event.target.value) || 0;
    this.props.sync(true);
    const index = this.scores.findIndex(score => score.id === id);
    if(index === -1)
      this.scores = [
        ...this.scores,
        { id: id, points: points }
      ];
    else
      this.scores = [
        ...this.scores.slice(0, index),
        { id: id, points: points },
        ...this.scores.slice(index + 1, this.scores.length)
      ];
    this.timeout = setTimeout(this.updateScores, 2000);
  };

  handleSetPlayerPod = (id, pod) => () => {
    this.props.onSetPlayerPod(id, pod);
  };

  handleRemovePlayer = (id, drop) => () => {
    if(drop)
      this.props.onRemovePlayer(id);
    else
      this.props.onReinstatePlayer(id);
  };

  render() {
    const {
      classes,
      players,
      playerSort,
      rounds,
      activeRound,
      done
    } = this.props;
    const currentRound = rounds === activeRound && !done;
    const newPlayers = players.filter(p => !p.hasOwnProperty(activeRound) && !p.dropped);
    const podPlayers = players.filter(p => p.hasOwnProperty(activeRound));
    const droppedPlayers = players.filter(p => !p.hasOwnProperty(activeRound) && p.dropped);
    const podCount = podPlayers.reduce((m, v) => Math.max(m, v[activeRound].pod), 0);
    let pods = [];
    if(activeRound) {
      for (var i = 1; i <= podCount; i++) {
        pods.push({
          pod: i,
          players: podPlayers.filter(p => p[activeRound].pod === i)
            .map(player => ({
              id: player.id,
              name: player.name,
              dropped: player.dropped,
              points: player[activeRound].points,
            }))
            .sort(playerSort)
        });
      }
    }
    return (
      <div>
        <div className={classes.hideOnPrint}>
          {newPlayers.length > 0 && (
            <Card className={classes.margined}>
              <CardHeader
                title={`${rounds ? '' : 'New '}Players`}
              />
              <Divider />
              <CardContent>
                <List>
                {newPlayers.map(({id, name}) => {
                  return (
                    <ListItem key={id} id={id} button>
                      {!currentRound ? null : (
                        <MenuButton
                          buttonType='icon'
                          buttonContent={
                            <Tooltip title={`Move ${name} to a different pod`}>
                              <GroupWorkIcon color='primary' />
                            </Tooltip>
                          }
                          menuItems={pods.map(d => ({
                            label: `Move to Pod ${d.pod} (${d.players.length} players)`,
                            icon: <ArrowRightAltIcon />,
                            action: this.handleSetPlayerPod(id, d.pod),
                          })).concat({
                            label: `Move to new pod (Pod ${pods.length + 1})`,
                            icon: <AddIcon />,
                            action: this.handleSetPlayerPod(id, pods.length + 1),
                          })}
                          paperStyle={this.props.classes.menuButtonPaper}
                        />
                      )}
                      <ListItemText primary={name} />
                      {!rounds || !currentRound ? null : (
                        <ListItemSecondaryAction>
                          <IconButton onClick={this.handleRemovePlayer(id, true)}>
                            <Tooltip title={`Remove ${name} from tournament`}>
                              <DeleteIcon color='primary' />
                            </Tooltip>
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                  );
                })}
                </List>
              </CardContent>
            </Card>
          )}
          {podPlayers.length > 0 &&
            pods.map(pod => (
              <Card key={pod.pod} className={classes.margined}>
                <CardHeader
                  title={`Pod ${pod.pod}`}
                />
                <Divider />
                <CardContent>
                  <List>
                  {pod.players.map(({id, name, dropped, points}) => {
                    let pointsSoFar = players.filter(p => p.id === id)[0].points;
                    return (
                      <ListItem key={id} id={id} button>
                        {!currentRound ? null : (
                          <MenuButton
                            buttonType='icon'
                            buttonContent={
                              <Tooltip title={`Move ${name} to a different pod`}>
                                <GroupWorkIcon className={classes.unmargined} color={dropped ? 'error' : 'primary'} />
                              </Tooltip>
                            }
                            menuItems={pods.filter(d => d.pod !== pod.pod).map(d => ({
                              label: `Move to Pod ${d.pod} (${d.players.length} players)`,
                              icon: <ArrowRightAltIcon color='primary' />,
                              action: this.handleSetPlayerPod(id, d.pod),
                            })).concat({
                              label: `Move to new pod (Pod ${pods.length + 1})`,
                              icon: <AddIcon />,
                              action: this.handleSetPlayerPod(id, pods.length + 1),
                            })}
                            paperStyle={this.props.classes.menuButtonPaper}
                          />
                        )}
                        <ListItemText primary={name} secondary={currentRound ? `${pointsSoFar} points` : null} />
                        <ListItemSecondaryAction>
                          {!currentRound ? points : (
                            <TextField
                              aria-label={`Points for player ${name}`}
                              margin='dense'
                              className={classes.scoreField}
                              required
                              type='number'
                              defaultValue={points}
                              onChange={this.handleScorePlayer(id)}
                            />
                          )}
                          {!currentRound ? null : (
                            <Tooltip title={dropped ? 'Reinstate Player' : 'Drop Player'}>
                              <IconButton
                                className={classes.marginedLeft}
                                onClick={this.handleRemovePlayer(id, !dropped)}
                              >
                                {dropped ? <RestoreFromTrashIcon color='error' /> : <DeleteIcon color='primary' />}
                              </IconButton>
                            </Tooltip>
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    );
                  })}
                  </List>
                </CardContent>
              </Card>
            ))
          }
          {droppedPlayers.length > 0 && (
            <Card className={classes.margined}>
              <CardHeader
                title={`Dropped Players`}
              />
              <Divider />
              <CardContent>
                <List>
                {droppedPlayers.map(({id, name}) => {
                  return (
                    <ListItem key={id} id={id} button>
                      {!currentRound ? null : (
                        <MenuButton
                          buttonType='icon'
                          buttonContent={
                            <Tooltip title={`Reinstate ${name} and add them to a Pod`}>
                              <GroupWorkIcon color='primary' />
                            </Tooltip>
                          }
                          menuItems={pods.map(d => ({
                            label: `Move to Pod ${d.pod} (${d.players.length} players)`,
                            icon: <ArrowRightAltIcon />,
                            action: this.handleSetPlayerPod(id, d.pod),
                          })).concat({
                            label: `Move to new pod (Pod ${pods.length + 1})`,
                            icon: <AddIcon />,
                            action: this.handleSetPlayerPod(id, pods.length),
                          })}
                          paperStyle={this.props.classes.menuButtonPaper}
                        />
                      )}
                      <ListItemText primary={name} />
                    </ListItem>
                  );
                })}
                </List>
              </CardContent>
            </Card>
          )}
        </div>
        <div className={classes.showOnPrint}>
          {pods.map(pod => (
            <div key={pod.pod} className={classes.printPod}>
              <Typography variant='headline' className={classes.flex}>
                {`Round ${activeRound}, Pod ${pod.pod}`}
                <span className={classes.right}>Points</span>
              </Typography>
              <List>
                {pod.players.map(({id, name}) => (
                  <ListItem key={id}>
                    <ListItemText primary={name} />
                    <ListItemSecondaryAction>
                      <div className={classes.printPodEntry} />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
          ))}
          {!pods.length && (
            <div>
              <Typography variant='headline'>Participants</Typography>
              <List>
                {players.sort(playerSort).map(({ id, name }) => (
                  <ListItem key={id} dense className={classes.printList}>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            </div>
          )}
        </div>
      </div>
    );
  }
}

TournamentRounds.defaultProps = {
  players: [],
  playerSort: (a, b) => 0,
  rounds: 0,
  activeRound: 0,
  done: false,
  onSetPlayerPod: (id, pod) => null,
  onUpdateScores: scores => null,
  onRemovePlayer: id => null,
  onReinstatePlayer: id => null,
  sync: bool => null,
};

TournamentRounds.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  players: PropTypes.array,
  playerSort: PropTypes.func,
  rounds: PropTypes.number,
  activeRound: PropTypes.number,
  done: PropTypes.bool,
  onSetPlayerPod: PropTypes.func,
  onUpdateScores: PropTypes.func,
  onRemovePlayer: PropTypes.func,
  onReinstatePlayer: PropTypes.func,
  sync: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(TournamentRounds);
