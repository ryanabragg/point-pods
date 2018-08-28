import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Zoom from '@material-ui/core/Zoom';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/SettingsSharp';
import SendIcon from '@material-ui/icons/Send';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep';
import ShuffleIcon from '@material-ui/icons/Shuffle';
import SortIcon from '@material-ui/icons/Sort';
import PollIcon from '@material-ui/icons/Poll';
import SyncIcon from '@material-ui/icons/Sync';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import DoneIcon from '@material-ui/icons/Done';
import UndoIcon from '@material-ui/icons/Undo';

import AppMenu from '../components/AppMenu';
import MenuButton from '../components/MenuButton';
import SwipeTabControl from '../components/SwipeTabControl';
import TournamentRound from '../components/TournamentRound';
import TournamentParticipants from '../components/TournamentParticipants';
import TournamentSettings from '../components/TournamentSettings';

const styles = theme => ({
  actionButton: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: 2 * theme.spacing.unit,
    zIndex: 12,
  },
  margined: {
    margin: theme.spacing.unit,
  },
  marginedRight: {
    marginRight: theme.spacing.unit,
  },
  menuButtonPaper: {
    maxHeight: theme.spacing.unit * 6 * 5.5,
    overflow: 'auto',
  },
  right: {
    marginLeft: 'auto',
  },
  spinning: {
    'animation-name': 'basic-spin',
    'animation-duration': '4s',
    'animation-iteration-count': 'infinite',
  },
  '@keyframes basic-spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(-360deg)',
    },
  },
  red: {
    color: theme.palette.error.main,
  },
});

class Tournament extends Component {
  state = {
    tabIndex: 1,
    dialog: null,
    sync: false,
    activeRound: 0,
    allPlayers: [],
    categories: [],
    pairingMethods: [],
    id: this.props.match.params.id || null,
    name: '',
    category: '',
    description: '',
    date: '',
    pairingMethod: 0,
    pairingMethodInitial: 0,
    podSizeMinimum: 0,
    podSizeMaximum: 0,
    rounds: 0,
    done: false,
    staging: true,
    players: [/*{
      id,
      name,
      points,
      participated,
      dropped,
      ROUND#: {
        pod,
        points,
      },
    }*/],
  };

  componentDidMount() {
    if(this.state.id === null)
      return this.goBack();
    let loadState = {
      pairingMethods: Object.keys(this.props.api.pairingMethods)
        .map(key => ({
          label: key.slice(0,1).toUpperCase() + key.slice(1).toLowerCase(),
          value: this.props.api.pairingMethods[key],
        })),
    };
    this.props.api.Settings.get()
      .then((settings) => Object.assign(loadState, settings))
      .then(() => this.props.api.Tournaments.all())
      .then(list => {
        Object.assign(loadState, {
          categories: list.map(tournament => tournament.category)
            .filter((cat, i, self) => self.indexOf(cat) === i),
        });
        if(!this.state.id)
          throw new Error('Invalid ID');
        const index = list.findIndex(t => String(t.id) === this.state.id);
        if(index === -1)
          throw new Error('ID not found');
        Object.assign(loadState, list[index], {activeRound: list[index].rounds});
      })
      .then(() => this.props.api.Players.all())
      .then(list => loadState.allPlayers = list || [])
      .then(() => this.setState(loadState))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.goBack();
      });
  }

  goBack = () => {
    this.props.history.go(-1);
  };

  // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  knuthShuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };

  getPods = (players, method, min, max) => {
    const activePlayers = players.filter(player => !player.dropped);
    const podCount = Math.ceil(activePlayers.length / max);
    return new Promise((resolve, reject) => {
      if(activePlayers.length < min)
        return reject('Insufficient players');
      return resolve();
    })
      .then(() => {
        if(method === this.props.api.pairingMethods.HISTORIC) {
          return this.props.api.Players.all()
            .then(list => activePlayers.map(({id, points}) => ({
              id: id,
              points: points + list.filter(p => p.id === id)[0].points,
            })));
        }
        return activePlayers;
      })
      .then(unsorted => {
        this.knuthShuffle(unsorted);
        if(method === this.props.api.pairingMethods.RANDOM)
          return unsorted;
        return unsorted.sort((a, b) => a.points > b.points ? 1 : a.points < b.points ? -1 : 0);
      })
      .then(sorted => {
        let pods = {};
        let podSize = 0;
        for(var pod = 1; pod <= podCount; pod++) {
          if(sorted.length <= max)
            podSize = sorted.length;
          else if(sorted.length - max <= 2 * min) {
            podSize = Math.min(max, min + sorted.length % min);
          }
          else if(sorted.length <= 2 * max)
            podSize = Math.floor((min + max ) / 2 );
          else
            podSize = max;
          for(var n = podSize - 1; n >= 0; n--) {
            const p = sorted.pop();
            pods[p.id] = pod;
          }
        }
        return pods;
      });
  };

  sortPlayerByName = (a, b) => {
    let first = a.name.toLowerCase();
    let second = b.name.toLowerCase();
    return first < second ? -1 : first > second ? 1 : 0;
  };

  updatePlayerPoints = (player, rounds) => {
    let update = Object.assign({}, player, {points: 0});
    for (var i = 1; i <= rounds; i++) {
      if(player.hasOwnProperty(i))
        update.points += update[i].points;
    }
    return update;
  };

  setValue = (key, value) => this.setState({[key]: value});

  handleSetValue = (key, value) => () => this.setState({[key]: value});

  handleSetValueOf = (key) => (value) => this.setState({[key]: value});

  handleDelete = () => {
    this.props.api.Tournaments.remove(this.state.id)
      .then(() => {
        this.props.notification(`Deleted tournament ${this.state.name}`);
        this.props.history.push('/tournaments');
      })
      .catch(error => this.props.notification(error.message, 'error'));
  };

  handleSelectPlayer = (selected, action) => {
    if(selected === null)
      return;
    let index = this.state.players.findIndex(p => p.id === selected.id);
    if(index > -1)
      return this.props.notification('Player already added', 'error');
    index = this.state.allPlayers.findIndex(p => p.id === selected.id);
    if(index === -1)
      return this.props.notification('Player not found', 'error');
    const player = {
      id: this.state.allPlayers[index].id,
      name: this.state.allPlayers[index].name,
      points: 0,
      participated: false,
      dropped: false,
    };
    this.setState({sync: true});
    this.props.api.Tournaments.set({
      id: this.state.id,
      players: [...this.state.players, player],
    })
      .then(tournament =>
        this.setState((prevState, props) => {
          let nextState = Object.assign({}, prevState);
          nextState.sync = false;
          nextState.players = [...nextState.players, player];
          return nextState;
        })
      )
      .then(() => this.props.notification(`Added player ${player.name}`))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  handleSelectCreatePlayer = (name) => {
    this.setState({sync: true});
    this.props.api.Players.set({name: name})
      .then(player =>
        this.props.api.Tournaments.set({
          id: this.state.id,
          players: [...this.state.players, player],
        })
          .then(tournament =>
            this.setState((prevState, props) => {
              let nextState = Object.assign({}, prevState);
              nextState.sync = false;
              nextState.allPlayers = [...nextState.allPlayers, player];
              nextState.players = [...nextState.players, player];
              return nextState;
            })
          )
          .then(() => this.props.notification(`Created player ${player.name}`))
      )
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  handleRemovePlayer = (id) => {
    this.setState({sync: true});
    let { players } = this.state;
    const index = players.findIndex(p => p.id === id);
    if(index === -1)
      return this.props.notification('Player not found in tournament', 'error');
    const player = players[index];
    this.props.api.Tournaments.set({
      id: this.state.id,
      players: [
        ...players.slice(0, index),
        ...players.filter(p => p.id === id && p.participated)
          .map(p => Object.assign({}, p, {dropped: true})),
        ...players.slice(index + 1, players.length),
      ],
    })
      .then(tournament => this.setState(Object.assign({}, tournament, {sync: false})))
      .then(() => this.props.notification(`${player.participated ? 'Dropped' : 'Removed'} player ${player.name}`))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  handleRemoveAllPlayers = () => {
    this.setState({sync: true});
    let { players } = this.state;
    this.props.api.Tournaments.set({
      id: this.state.id,
      players: players.filter(p => p.participated)
        .map(player => Object.assign({}, player, {dropped: true})),
    })
      .then(tournament => this.setState(Object.assign({}, tournament, {sync: false})))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  handleReinstatePlayer = (id) => {
    this.setState({sync: true});
    let { players } = this.state;
    const index = players.findIndex(p => p.id === id);
    if(index === -1)
      return this.props.notification('Player not found in tournament', 'error');
    const player = players[index];
    this.props.api.Tournaments.set({
      id: this.state.id,
      players: [
        ...players.slice(0, index),
        ...players.filter(p => p.id === id)
          .map(p => Object.assign({}, p, {dropped: false})),
        ...players.slice(index + 1, players.length),
      ],
    })
      .then(tournament => this.setState(Object.assign({}, tournament, {sync: false})))
      .then(() => this.props.notification(`Reinstated player ${player.name}`))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  handleNewRound = () => {
    const { pairingMethod, pairingMethodInitial, podSizeMaximum, podSizeMinimum, rounds } = this.state;
    const newRound = rounds + 1;
    const players = this.state.players.map(p => this.updatePlayerPoints(p, rounds));
    this.getPods(players, (rounds ? pairingMethod : pairingMethodInitial), podSizeMinimum, podSizeMaximum)
      .then(pods => {
        let keys = Object.keys(pods);
        return players.map(player => {
          if(!keys.includes(String(player.id)))
            return player;
          return Object.assign(
            {},
            player,
            { participated: true,
              [newRound]: {
                pod: pods[player.id],
                points: 0
              },
            }
          );
        });
      })
      .then(newPlayers => this.props.api.Tournaments.set({
        id: this.state.id,
        rounds: newRound,
        staging: false,
        players: newPlayers,
      }))
      .then(tournament => this.setState({
        activeRound: newRound,
        rounds: newRound,
        staging: false,
        players: tournament.players,
      }))
      .catch(error => this.props.notification(error.message, 'error'));
  };

  handleCreatePods = (method) => () => {
    let { podSizeMaximum, podSizeMinimum, rounds, players } = this.state;
    this.getPods(players, method, podSizeMinimum, podSizeMaximum)
    .then(pods => {
      let count = {};
      Object.values(pods).forEach(v => count[v] = (count[v] || 0) + 1);
      let under = [];
      Object.keys(count).forEach(k => {
        if(count[k] < podSizeMinimum)
          under.push(k);
      });
      if(under.length)
        this.props.notification(`Pod${under.length !== 1 ? 's' : ''} ${under.reduce((a, v, i, s) => a + `${v} `, '').trim()} ${under.length !== 1 ? 'have' : 'has'} insufficient players`, 'warning');
      return pods;
    })
      .then(pods => {
        let keys = Object.keys(pods);
        return players.map(player => {
          if(!keys.includes(String(player.id)))
            return player;
          return Object.assign(
            {},
            player,
            { participated: true,
              [rounds]: {
                pod: pods[player.id],
                points: 0
              },
            }
          );
        });
      })
      .then(newPlayers => this.props.api.Tournaments.set({
        id: this.state.id,
        players: newPlayers,
      }))
      .then(tournament => this.setState({
        players: tournament.players,
      }))
      .catch(error => this.props.notification(error.message, 'error'));
  };

  handleSetPlayerPod = (id, pod) => {
    let { rounds, players } = this.state;
    const index = players.findIndex(p => p.id === id);
    if(index === -1)
      return this.props.notification('Player not found in tournament', 'error');
    if(players[index].hasOwnProperty(rounds) && players[index][rounds].points)
      return this.props.notification('Player given points in current pod', 'error');
    this.props.api.Tournaments.set({
      id: this.state.id,
      players: [
        ...players.slice(0, index),
        ...players.filter(p => p.id === id)
          .map(p => Object.assign({}, p, {dropped: false, [rounds]: { pod: pod, points: 0}})),
        ...players.slice(index + 1, players.length),
      ],
    })
      .then(tournament => this.setState(tournament))
      .catch(error => this.props.notification(error.message, 'error'));
  };

  handleUpdateScores = scores => {
    const { rounds } = this.state;
    let players = this.state.players.map(player => {
      let index = scores.findIndex(s => s.id === player.id);
      if(index === -1)
        return player;
      return Object.assign({}, player, {
        [rounds]: {
          pod: player[rounds].pod,
          points: scores[index].points
        },
      });
    });
    this.props.api.Tournaments.set({
      id: this.state.id,
      players: players,
    })
      .then(tournament => this.setState(Object.assign({}, tournament, {sync: false})))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  handleTournamentEnd = done => () => {
    this.setState({sync: true});
    const players = this.state.players.map(p => this.updatePlayerPoints(p, this.state.rounds));
    this.props.api.Tournaments.set({
      id: this.state.id,
      done: done,
      players: players,
    })
      .then(tournament => this.setState(Object.assign({}, tournament, {sync: false})))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  handleUpdateSettings = (key, value) => {
    let update = {
      [key]: value
    };
    if(key === 'category' && !this.state.categories.includes(value))
      update.categories = [
        ...this.state.categories,
        value
      ];
    this.setState(update);
  };

  handleRevertSettings = () => {
    this.setState({sync: true});
    this.props.api.Tournaments.get(this.state.id)
      .then(tournament => {
        const {
          name,
          category,
          description,
          date,
          pairingMethod,
          pairingMethodInitial,
          podSizeMinimum,
          podSizeMaximum,
        } = tournament;
        this.setState({
          dialog: null,
          name,
          category,
          description,
          date,
          pairingMethod,
          pairingMethodInitial,
          podSizeMinimum,
          podSizeMaximum,
          sync: false,
        });
      })
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  handleSaveSettings = () => {
    const {
      name,
      category,
      description,
      date,
      pairingMethod,
      pairingMethodInitial,
      podSizeMinimum,
      podSizeMaximum,
    } = this.state;
    this.setState({sync: true});
    if(!name.length)
      return this.props.notification('Name cannot be empty', 'error');
    if(podSizeMinimum > podSizeMaximum)
      return this.props.notification('Minimum pod size exceeds maximum', 'error');
    this.props.api.Tournaments.set({
      id: this.state.id,
      name,
      category,
      description,
      date,
      pairingMethod,
      pairingMethodInitial,
      podSizeMinimum,
      podSizeMaximum,
    })
      .then(tournament => this.setState(Object.assign({}, tournament, {dialog: null, sync: false})))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.setState({sync: false});
      });
  };

  renderToolbar = () => {
    const { sync, rounds, activeRound, done, players } = this.state;
    const { classes } = this.props;
    const { pairingMethods } = this.props.api;
    let tournamentMenu = [{
      label: rounds ? 'New Round' : 'Start Tournament',
      icon: rounds ? <AddIcon /> : <SendIcon />,
      action: this.handleNewRound,
    }, {
      label: `Re-Pod Randomly`,
      icon: <ShuffleIcon />,
      action: this.handleCreatePods(pairingMethods.RANDOM),
    }, {
      label: `Re-Pod By Points`,
      icon: <SortIcon />,
      action: this.handleCreatePods(pairingMethods.POINTS),
    }, {
      label: `Re-Pod By Historic Points`,
      icon: <PollIcon />,
      action: this.handleCreatePods(pairingMethods.HISTORIC),
    }, {
      label: 'End Tournament',
      icon: <DoneIcon />,
      action: this.handleTournamentEnd(true),
    }];
    if(!rounds)
      tournamentMenu.pop();
    if(!rounds || activeRound !== rounds)
      tournamentMenu.splice(1, 3);
    if(done) {
      tournamentMenu = [{
      label: 'Reopen Tournament',
      icon: <UndoIcon />,
      action: this.handleTournamentEnd(false),
      }, {
        label: 'Delete Tournament',
        icon: <DeleteIcon />,
        action: this.handleSetValue('dialog', 'delete'),
      }];
    }
    tournamentMenu.push({
      label: 'Settings',
      icon: <SettingsIcon />,
      action: this.handleSetValue('dialog', 'settings'),
    });
    let playersMenu = [{
      label: `Remove All Players`,
      icon: <DeleteSweepIcon />,
      action: this.handleRemoveAllPlayers,
    }];
    let roundsMenu = [];
    for(var i = 1; i <= rounds; i++) {
      if(i !== activeRound)
        roundsMenu.push({
          label: `View Round ${i}`,
          icon: <ArrowRightAltIcon />,
          action: this.handleSetValue('activeRound', i),
        });
    }
    return (
      <React.Fragment>
        {!rounds
          ? (
            <MenuButton
              buttonType='normal'
              buttonProps={{color: 'inherit'}}
              buttonContent={`${players.length} Players`}
              menuItems={playersMenu}
              disablePortal
              paperStyle={classes.menuButtonPaper}
            />
          )
          : (
            <MenuButton
              buttonType='normal'
              buttonProps={{color: 'inherit'}}
              buttonContent={`Round ${activeRound} of ${rounds}`}
              menuItems={roundsMenu}
              disablePortal
              paperStyle={classes.menuButtonPaper}
            />
          )
        }
        {sync
          ? (
            <IconButton color='inherit' className={classes.spinning}>
              <SyncIcon />
            </IconButton>
          )
          : (
            <MenuButton
              buttonType='icon'
              buttonProps={{color: 'inherit'}}
              buttonContent={<MoreVertIcon />}
              disablePortal
              menuItems={tournamentMenu}
            />
          )
        }
      </React.Fragment>
    );
  };

  render() {
    const { classes, theme } = this.props;
    const {
      tabIndex,
      dialog,
      sync,
      categories,
      pairingMethods,
      name,
      category,
      description,
      date,
      pairingMethod,
      pairingMethodInitial,
      podSizeMinimum,
      podSizeMaximum,
      rounds,
      done,
      staging,
      players,
      allPlayers,
      activeRound
    } = this.state;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };
    const showStartFab = !rounds && tabIndex < 2;
    return (
      <div>
        <AppMenu title={name}
          usesBackIcon onBack={this.goBack}
          toolbar={this.renderToolbar()}
        />
        <Zoom
          in={showStartFab}
          timeout={transitionDuration}
          style={{
            transitionDelay: `${showStartFab ? transitionDuration.exit : 0}ms`,
          }}
          unmountOnExit
        >
          <Button variant="extendedFab"
            aria-label='Start Tournament'
            color='secondary'
            className={classes.actionButton}
            onClick={this.handleNewRound}
          >
            <SendIcon className={classes.marginedRight} />
            Start
          </Button>
        </Zoom>
        <SwipeTabControl
          tabs={[
            {key: 1, label: 'Pods'},
            {key: 2, label: 'Players'},
            //{key: 3, label: 'Settings'},
          ]}
          goToTab={staging ? 1 : 0}
          onChange={this.handleSetValueOf('tabIndex')}
        >
          <TournamentRound
            players={players}
            playerSort={this.sortPlayerByName}
            rounds={rounds}
            activeRound={activeRound}
            done={done}
            onSetPlayerPod={this.handleSetPlayerPod}
            onUpdateScores={this.handleUpdateScores}
            onRemovePlayer={this.handleRemovePlayer}
            onReinstatePlayer={this.handleReinstatePlayer}
            sync={this.handleSetValueOf('sync')}
          />
          <TournamentParticipants
            displayOnly={done}
            isSyncing={sync}
            players={players}
            allPlayers={allPlayers}
            sort={this.sortPlayerByName}
            onSelectPlayer={this.handleSelectPlayer}
            onSelectCreatePlayer={this.handleSelectCreatePlayer}
            onRemovePlayer={this.handleRemovePlayer}
            onReinstatePlayer={this.handleReinstatePlayer}
          />
        </SwipeTabControl>

        <Dialog
          open={dialog === 'settings'}
          onClose={this.handleSetValue('dialog', null)}
          aria-label='tournament-settings'
          scroll='body'
        >
          <DialogContent>
            <TournamentSettings
              pairingMethods={pairingMethods}
              categories={categories}
              name={name}
              category={category}
              description={description}
              date={date}
              pairingMethod={pairingMethod}
              pairingMethodInitial={pairingMethodInitial}
              podSizeMinimum={podSizeMinimum}
              podSizeMaximum={podSizeMaximum}
              onChange={this.handleUpdateSettings}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              color='primary'
              onClick={this.handleRevertSettings}>
              Revert
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleSaveSettings}
              className={classes.right}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={dialog === 'delete'}
          onClose={this.handleSetValue('dialog', null)}
          aria-labelledby='delete-tournament'
        >
          <DialogTitle id='delete-tournament'>Delete Tournament</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this tournament?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button 
              variant='contained'
              color='primary'
              onClick={this.handleSetValue('dialog', null)}>
              Cancel
            </Button>
            <Button
              onClick={this.handleDelete}
              className={classNames(classes.red, classes.right)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Tournament.defaultProps = {
  history: {
    go: () => null,
    push: () => null,
    replace: () => null,
  },
  match: {
    params: {
      id: null,
    },
  },
  notification: (m, v, d, c) => null,
};

Tournament.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  theme: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object, // added by parent Route
  match: PropTypes.object, // added by parent Route
  notification: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(withAPI(Tournament));
