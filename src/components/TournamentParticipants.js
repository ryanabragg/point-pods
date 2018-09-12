import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';

import Select from '../components/Select';

const styles = theme => ({
  root: {
    minHeight: 400,
  },
  margined: {
    margin: theme.spacing.unit,
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

class TournamentParticipants extends Component {
  state = {
    value: null,
  };

  handleSetValue = (key) => (value) => {
    this.setState({[key]: value});
  };

  handleSelect = (selected, action) => {
    this.props.onSelectPlayer(selected, action);
    this.setState({value: ''});
  };

  handleCreate = (name) => {
    this.props.onSelectCreatePlayer(name);
    this.setState({value: ''});
  };

  handleRemove = (id) => () => {
    this.props.onRemovePlayer(id);
  };

  handleReinstate = (id) => () => {
    this.props.onReinstatePlayer(id);
  };

  render() {
    const {
      classes,
      displayOnly,
      isSyncing,
      players,
      allPlayers,
      sort,
    } = this.props;
    const { value } = this.state;
    const participants = players.reduce((a, v, i, s) => a.concat(v.id), []);
    const playerOptions = allPlayers.map(p => (
      Object.assign({}, p, {disabled: participants.includes(p.id)})
    )).sort(sort);
    return (
      <div className={classes.root}>
        {!displayOnly && (
          <AppBar position='sticky' color='inherit' className={classes.hideOnPrint}>
            <Select
              aria-label='add-player'
              isCreatable
              isClearable
              isDisabled={isSyncing}
              isLoading={isSyncing}
              placeholder='Select player or enter new player name'
              onChange={this.handleSelect}
              onCreateOption={this.handleCreate}
              isValidNewOption={(inputValue, selectValue, selectOptions) => !(
                !inputValue ||
                selectValue.some(option => inputValue.toLowerCase() === option.name.toLowerCase()) ||
                selectOptions.some(option => inputValue.toLowerCase() === option.name.toLowerCase())
              )}
              getNewOptionData={(inputValue, optionLabel) => ({
                name: optionLabel,
              })}
              formatCreateLabel={inputValue => `Create player ${inputValue}`}
              options={playerOptions}
              getOptionLabel={option => option.name}
              getOptionValue={option => option.id}
              isOptionDisabled={option => option.disabled}
              value={value}
              onInputChange={this.handleSetValue('value')}
              className={classes.margined}
            />
          </AppBar>
        )}
        <List className={classes.hideOnPrint}>
          {players.sort(sort).map(player => {
            let { id, name, points, participated, dropped } = player;
            return (
            <ListItem key={id}>
              {displayOnly ? null : dropped
                ? (
                  <IconButton aria-label='Reinstate Player' onClick={this.handleReinstate(id)}>
                    <AddIcon />
                  </IconButton>
                )
                : (
                  <IconButton aria-label='Remove Player' onClick={this.handleRemove(id)}>
                    {participated ? <ClearIcon /> : <DeleteIcon />}
                  </IconButton>
                )
              }
              <ListItemText primary={name} secondary={dropped ? 'Dropped' : `Points: ${points}`} />
            </ListItem>
            );
          })}
        </List>
        <div className={classes.showOnPrint}>
          <Typography variant='headline'>Participants</Typography>
          <List>
            {players.sort(sort).map(({ id, name }) => (
              <ListItem key={id} dense className={classes.printList}>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

TournamentParticipants.defaultProps = {
  displayOnly: false,
  isSyncing: false,
  players: [],
  allPlayers: [],
  sort: (a, b) => 0,
  onSelectPlayer: (selected, action) => {},
  onSelectCreatePlayer: (name) => {},
  onRemovePlayer: (id) => {},
  onReinstatePlayer: (id) => {},
};

TournamentParticipants.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  displayOnly: PropTypes.bool,
  isSyncing: PropTypes.bool,
  players: PropTypes.array,
  allPlayers: PropTypes.array,
  sort: PropTypes.func,
  onSelectPlayer: PropTypes.func,
  onSelectCreatePlayer: PropTypes.func,
  onRemovePlayer: PropTypes.func,
  onReinstatePlayer: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(TournamentParticipants);
