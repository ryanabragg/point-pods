import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

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
import TournamentCards from '../components/TournamentCards';

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

class TournamentList extends Component {
  state = {
    dialog: null,
    newPlayer: '',
    newTournament: false,
    searching: false,
    searchTerm: '',
    category: '',
    status: '',
    sort: {
      field: 'name',
      ascending: true,
    },
    tournaments: [],
    selected: [],
    categories: [],
  };

  componentDidMount() {
    this.props.api.Tournaments.all()
      .then(list => {
        let categories = list.map(tournament => tournament.category)
          .filter((cat, i, self) => cat && self.indexOf(cat) === i).sort();
        this.setState({
          tournaments: list,
          categories: categories,
        });
      })
      .catch(error => this.props.notification(error.message, 'error'));
  }

  sorting = (a, b) => {
    const { field, ascending } = this.state.sort;
    let left = a[field],
      right = b[field];
    if(['name', 'category'].includes(field)) {
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

  onSelect = (selected) => {
    this.setState({ selected: selected });
  };

  handleUpdateValue = (key, value) => () => {
    this.setState({[key]: value});
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
            label: 'Sort By Date',
            icon: <SortIcon />,
            action: this.setSort('date'),
          }]}
          disablePortal
        />
      </React.Fragment>
    );
  };

  renderDialogCategories = () => null;

  render() {
    const { classes, history, notification } = this.props;
    const { dialog, newTournament, searching, searchTerm, tournaments, selected } = this.state;
    const cards = Array.from(tournaments).sort(this.sorting);
    let showDialog;
    switch(dialog) {
      case 'categories': showDialog = this.renderDialogCategories(); break;
      default: showDialog = null;
    }
    return (
      <div>
        <AppMenu
          title={searching ? '' : 'Tournaments'}
          color={searching ? 'secondary' : 'primary'}
          history={history}
          notification={notification}
          showNew={newTournament}
          onCancelNew={this.handleUpdateValue('newTournament', false)}
          toolbar={this.renderToolbar()}
        />
        <Button
          variant='fab'
          color='secondary'
          aria-label='New Tournament'
          className={classes.actionButton}
          onClick={this.handleUpdateValue('newTournament', true)}
        >
          <AddIcon />
        </Button>
        <TournamentCards
          tournaments={cards}
          selected={selected}
          onSelect={this.onSelect}
          search={searchTerm}
        />
        {showDialog}
      </div>
    );
  }
}

TournamentList.defaultProps = {
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

TournamentList.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object, // added by parent Route
  match: PropTypes.object, // added by parent Route
  notification: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(withAPI(TournamentList));
