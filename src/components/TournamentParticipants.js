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
    id: null,
    players: [],
    participants: [],
  };

  componentDidMount() {
    if(!this.props.id && this.props.id !== 0)
      return;
    let loadState = { id: this.props.id };
    this.props.api.Tournaments.get(this.props.id)
      .catch(error => {
        console.log(error.message);
      })
      .then(tournament => loadState.participants = tournament.players || [])
      .then(() => this.props.api.Players.all())
      .then(list => loadState.players = list || [])
      .catch(error => console.log(error.message))
      .then(() => this.setState(loadState));
  }

  handleToggleMenu = (show) => event => {
    const value = event ? event.currentTarget : null;
    this.setState({ menuAnchor: show ? value : null });
  };

  handleSelect = ({ id, label }) => {
    if(!label.length || this.state.id === null)
      return;
    return new Promise((resolve, reject) => {
      const found = this.state.players.filter(player => player.id === id);
      if(id === null || !found.length)
        return reject('Player record not found');
      resolve(found[0]);
    })
      .catch(error => 
        this.props.api.Players.set({name: label})
        .then(player => {
          this.setState({ players: this.state.players.concat(player) });
          console.log('info', `Created player ${player.name}`, player);
          return player;
        })
      )
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
          id: this.state.id,
          players: participants,
        })
        .then(tournament => {
          this.setState({ participants: participants });
        });
      })
      .catch(error => console.log('error', error.message));
  };

  removeParticipant = event => {
    if(this.state.id === null)
      return;
    const id = event.currentTarget.id;
    const participants = this.state.participants.filter(p => String(p.id) !== id);
    this.props.api.Tournaments.set({
      id: this.state.id,
      players: participants,
    })
      .then(() => {
        this.setState({
          participants: participants,
        });
      });
  };

  removeAllParticipants = event => {
    if(this.state.id === null)
      return;
    this.props.api.Tournaments.set({
      id: this.state.id,
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
    const { menuAnchor, id, players, participants} = this.state;
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
};

TournamentParticipants.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

export default withStyles(styles, { withTheme: true })(withAPI(TournamentParticipants));
