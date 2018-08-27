import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';

import AppMenu from '../components/AppMenu';
import TournamentCards from '../components/TournamentCards';

const styles = theme => ({
  actionButton: {
    margin: 2 * theme.spacing.unit,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

class Home extends Component {
  state = {
    tournaments: [],
    newTournament: false,
  };

  componentDidMount() {
    this.props.api.Tournaments.all()
      .then(list => this.setState({ tournaments: list }))
      .catch(error => this.props.notification(error.message, 'error'));
  }

  handleUpdateValue = (key, value) => () => {
    this.setState({[key]: value});
  };

  render() {
    const { classes, history, notification } = this.props;
    const { tournaments, newTournament } = this.state;
    return (
      <div>
        <AppMenu title='Point Pods'
          history={history}
          notification={notification}
          showNew={newTournament}
          onCancelNew={this.handleUpdateValue('newTournament', false)}
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
        <TournamentCards tournaments={tournaments} status='Incomplete' />
      </div>
    );
  }
}

Home.defaultProps = {
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

Home.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object, // added by parent Route
  match: PropTypes.object, // added by parent Route
  notification: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(withAPI(Home));
