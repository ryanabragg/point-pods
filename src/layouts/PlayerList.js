import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import SortIcon from '@material-ui/icons/Sort';

import AppMenu from '../components/AppMenu';
import MenuButton from '../components/MenuButton';
import PlayerCards from '../components/PlayerCards';

const styles = theme => ({
  actionButton: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    margin: 2 * theme.spacing.unit,
  },
  dialog: {
    minWidth: theme.breakpoints.values['xs'],
  },
  cancel: {
    color: theme.palette.error.main,
  },
  content: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  right: {
    marginLeft: 'auto',
  },
});

class PlayerList extends Component {
  state = {
    dialog: null,
    newPlayer: '',
    searching: false,
    searchTerm: '',
    sort: {
      field: 'name',
      ascending: true,
    },
    players: [],
    selected: [],
  };

  componentDidMount() {
    this.props.api.Players.all()
      .then(list => this.setState({ players: list }))
      .catch(error => this.props.notification(error.message, 'error'));
  }

  playerSorting = (a, b) => {
    const { field, ascending } = this.state.sort;
    let left = a[field],
      right = b[field];
    if(field === 'name') {
      left = left.toString().toLowerCase();
      right = right.toString().toLowerCase();
    }
    if(left < right)
      return ascending ? -1 : 1;
    else if(left > right)
      return ascending ? 1 : -1;
    return 0;
  };

  setSort = (field) => () => {
    let { sort } = this.state;
    if(field === sort.field)
      sort.ascending = !sort.ascending;
    else
      sort = {
        field: field,
        ascending: true,
      };
    this.setState({ sort });
  };

  setDialog = (dialog) => () => {
    this.setState({
      dialog: dialog,
      newPlayer: '',
    });
  };

  setSearching = (bool) => () => {
    let nextState = { searching: bool };
    if(!bool)
      nextState.searchTerm = '';
    this.setState(nextState);
  };

  onInputChange = name => event => {
    const value = event.target.value;
    this.setState({ [name]: value });
  };

  onSelectPlayer = (selected) => {
    this.setState({ selected: selected });
  };

  handleCreatePlayerFromDialog = () => {
    let nextState = {
      dialog: null,
      players: Array.from(this.state.players),
    };
    this.props.api.Players.set({name: this.state.newPlayer})
      .then(player => {
        nextState.players.push(player);
        this.props.notification(`Created player ${player.name}`, 'info');
      })
      .catch(error => this.props.notification(error.message, 'error'))
      .then(() => this.setState(nextState));
  };

  renderToolbar = () => {
    if(this.state.searching) {
      return (
        <React.Fragment>
          <TextField
            autoFocus
            margin='dense'
            id='search'
            label='Search'
            type='text'
            value={this.state.searchTerm}
            onChange={this.onInputChange('searchTerm')}
          />
          <IconButton
            color='inherit'
            onClick={this.setSearching(false)}
          >
            <CloseIcon />
          </IconButton>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <IconButton
          color={this.state.searchTerm ? 'secondary' : 'inherit'}
          onClick={this.setSearching(true)}
        >
          <SearchIcon />
        </IconButton>
        <MenuButton
          buttonType='icon'
          buttonProps={{color: 'inherit'}}
          buttonContent={<MoreVertIcon />}
          menuItems={[{
            label: 'Sort By Name',
            icon: <SortIcon />,
            action: this.setSort('name'),
          }, {
            label: 'Sort By Points',
            icon: <SortIcon />,
            action: this.setSort('points'),
          }]}
          disablePortal
        />
      </React.Fragment>
    );
  };

  renderDialogNewPlayer = () => (
    <Dialog
      open={this.state.dialog === 'new-player'}
      disableBackdropClick
      maxWidth='sm'
      className={this.props.classes.dialog}
      aria-labelledby='new-player-dialog'
      onClose={this.setDialog(null)}
    >
      <DialogTitle id='new-player-dialog'>New Player</DialogTitle>
      <Divider />
      <DialogContent className={this.props.classes.content}>
        <TextField
          id='new-player-name'
          label='Player Name'
          type='text'
          value={this.state.newPlayer}
          onChange={this.onInputChange('newPlayer')}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          id='new-player-cancel'
          aria-label='Cancel'
          onClick={this.setDialog(null)}
          className={this.props.classes.cancel}
        >
          Cancel
        </Button>
        <Button className={this.props.classes.right}
          id='new-player-submit'
          aria-label='Create Player'
          onClick={this.handleCreatePlayerFromDialog}
          variant='contained'
          color='primary'
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );

  render() {
    const { classes } = this.props;
    const { dialog, searching, searchTerm, players, selected } = this.state;
    const cards = Array.from(players).sort(this.playerSorting);
    let showDialog;
    switch(dialog) {
      case 'new-player': showDialog = this.renderDialogNewPlayer(); break;
      default: showDialog = null;
    }
    return (
      <div>
        <AppMenu
          title={searching ? '' : 'Players'}
          color={searching ? 'secondary' : 'primary'}
          toolbar={this.renderToolbar()}
        />
        <Button
          variant='fab'
          color='secondary'
          aria-label='New Player'
          className={classes.actionButton}
          onClick={this.setDialog('new-player')}
        >
          <AddIcon />
        </Button>
        <PlayerCards
          players={cards}
          selected={selected}
          onSelect={this.onSelectPlayer}
          search={searchTerm}
        />
        {showDialog}
      </div>
    );
  }
}

PlayerList.defaultProps = {
  notification: (m, v, d, c) => null,
};

PlayerList.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  notification: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(withAPI(PlayerList));
