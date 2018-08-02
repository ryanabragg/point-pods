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
    tournaments: []
  };

  componentDidMount() {
    this.props.api.Tournaments.all()
      .then(list => this.setState({ tournaments: list }))
      .catch(error => this.props.notification(error.message, 'error'));
  }

  render() {
    const { classes } = this.props;
    const { tournaments } = this.state;
    return (
      <div>
        <AppMenu title='Point Pods' />
        <Button
          variant='fab'
          color='secondary'
          aria-label='New Tournament'
          className={classes.actionButton}
          href='/new'
        >
          <AddIcon />
        </Button>
        <TournamentCards tournaments={tournaments} status='Incomplete' />
      </div>
    );
  }
}

Home.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
};

export default withStyles(styles, { withTheme: true })(withAPI(Home));
