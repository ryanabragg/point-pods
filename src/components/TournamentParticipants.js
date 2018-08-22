import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';

import Select from '../components/Select';

const styles = theme => ({
  margined: {
    margin: theme.spacing.unit,
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
    this.props.handleSelectPlayer(selected, action);
    this.setState({value: ''});
  };

  handleCreate = (name) => {
    this.props.handleSelectCreatePlayer(name);
    this.setState({value: ''});
  };

  handleRemove = (id) => () => {
    this.props.handleRemovePlayer(id);
  };

  handleReinstate = (id) => () => {
    this.props.handleUnDropPlayer(id);
  };

  render() {
    const {
      classes,
      sync,
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
      <div>
        <AppBar position='sticky' color='inherit'>
          <Select
            aria-label='add-player'
            isCreatable
            isClearable
            isDisabled={sync}
            isLoading={sync}
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
        <List>
          {players.sort(sort).map(player => {
            let { id, name, points, participated, dropped } = player;
            return (
            <ListItem key={id}>
              {dropped
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
      </div>
    );
  }
}

TournamentParticipants.defaultProps = {
  sync: false,
  players: [],
  allPlayers: [],
  sort: (a, b) => 0,
  handleSelectPlayer: (selected, action) => {},
  handleSelectCreatePlayer: (name) => {},
  handleRemovePlayer: (id) => {},
  handleUnDropPlayer: (id) => {},
};

TournamentParticipants.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  sync: PropTypes.bool,
  players: PropTypes.array,
  allPlayers: PropTypes.array,
  sort: PropTypes.func,
  handleSelectPlayer: PropTypes.func,
  handleSelectCreatePlayer: PropTypes.func,
  handleRemovePlayer: PropTypes.func,
  handleUnDropPlayer: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(TournamentParticipants);
