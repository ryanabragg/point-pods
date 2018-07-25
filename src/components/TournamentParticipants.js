import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';

import IntegrationAutosuggest from '../components/IntegrationAutosuggest';

import { withAPI } from '../api';

const styles = theme => ({
  right: {
    marginLeft: 'auto',
  },
  addPlayer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& > ul': {
      width: '100%',
      maxWidth: 420,
    },
    margin: theme.spacing.unit,
    bottom: 0,
  },
});

class TournamentParticipants extends Component {
  state = {
    menuAnchor: null,
    tournamentID: null,
    players: [],
    participants: [],
  };

  componentDidMount() {
    if(!this.props.match.params.id)
      return this.props.history.push('/');
    let loadState = { tournamentID: this.props.match.params.id };
    this.props.api.Tournaments.get(this.props.match.params.id)
      .catch(error => {
        console.log(error.message);
        this.props.history.push('/');
      })
      .then(tournament => loadState.participants = tournament.players)
      .then(() => this.props.api.Players.all())
      .then(list => loadState.players = list)
      .catch(error => console.log(error.message))
      .then(() => this.setState(loadState));
  }

  handleToggleMenu = (show) => event => {
    const value = event ? event.currentTarget : null;
    this.setState({ menuAnchor: show ? value : null });
  };

  handleSelect = ({ id, label }) => {
    if(!label.length)
      return;
    return new Promise((resolve, reject) => {
      const found = this.state.players.filter(player => player.id === id);
      if(id === null || !found.length)
        return reject('Player record not found');
      resolve(found[0]);
    })
      .catch(error => this.props.api.Players.set({name: label}))
      .then(player => {
        this.setState({ players: this.state.players.concat(player) });
        console.log('info', `Created player ${player.name}`, player);
        return player;
      })
      .then(player => {
        const added = this.state.participants.filter(p => p.id === player.id);
        if(added.length)
          throw new Error('Player already added');
        console.log('info', `Added player ${player.name}`, player);
        return this.state.participants.concat(player).map(player => ({
          id: player.id,
          name: player.name,
          points: 0,
        })).sort((a, b) => {
          if(a.name < b.name)
            return -1;
          else if(a.name > b.name)
            return 1;
          return 0;
        });
      })
      .then(participants => {
        return this.props.api.Tournaments.set({
          id: this.state.tournamentID,
          players: participants,
        })
        .then(tournament => {
          this.setState({ participants: participants });
        });
      })
      .catch(error => console.log('error', error.message));
  };

  removeParticipant = event => {
    const id = event.currentTarget.id;
    const participants = this.state.participants.filter(p => String(p.id) !== id);
    this.props.api.Tournaments.set({
      id: this.state.tournamentID,
      players: participants,
    })
      .then(() => {
        this.setState({
          participants: participants,
        });
      });
  };

  removeAllParticipants = event => {
    this.props.api.Tournaments.set({
      id: this.state.tournamentID,
      players: [],
    })
      .then(() => {
        this.setState({
          menuAnchor: null,
          participants: [],
        });
      });
  };

  render() {
    const { classes } = this.props;
    const { menuAnchor, players, participants} = this.state;
    return (
      <div>
        <Toolbar>
          <Typography variant='headline'>
            Add Players
          </Typography>
          <Typography>
          </Typography>
          <Button className={classes.right}
            aria-label='Players Menu'
            aria-owns={menuAnchor ? 'players-menu' : null}
            aria-haspopup='true'
            onClick={this.handleToggleMenu(true)}
          >
            {`${participants.length} Player${participants.length === 1 ? '' : 's'}`}
          </Button>
          <Menu
            id='players-menu'
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={this.handleToggleMenu(false)}
          >
            <MenuItem onClick={this.removeAllParticipants}>Remove All</MenuItem>
          </Menu>
        </Toolbar>
        <div className={classes.addPlayer}>
          <IntegrationAutosuggest
            items={players
              .filter(player => -1 === participants.findIndex(p => p.id === player.id))
              .map(p => ({ id: p.id, label: p.name }))
            }
            onSelect={this.handleSelect}
            clearOnSelect={true}
            buttonIcon={<AddIcon />}
          />
        </div>
        <div className={classes.list}>
          <List>
            {participants.map(player => (
              <ListItem key={player.id}>
                <IconButton aria-label='Remove Player' id={player.id} onClick={this.removeParticipant}>
                  <ClearIcon />
                </IconButton>
                <ListItemText primary={player.name} secondary={`Points: ${player.points}`}/>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

TournamentParticipants.defaultProps = {
  history: {
    push: () => null,
    replace: () => null,
  },
  match: {
    params: {
      id: null,
    },
  },
};

TournamentParticipants.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object, // added by parent
  match: PropTypes.object, // added by parent
};

export default withStyles(styles, { withTheme: true })(withAPI(TournamentParticipants));
