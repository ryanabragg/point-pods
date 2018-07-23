import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import AddIcon from '@material-ui/icons/Add';

import AppMenu from '../components/AppMenu';
import TournamentCardList from '../components/TournamentCardList';

const styles = theme => ({
  actionButton: {
    margin: 2 * theme.spacing.unit,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

class Home extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppMenu title='Point Pods' />
        <Button
          variant='fab'
          color='secondary'
          aria-label='Add'
          className={classes.actionButton}
          href='/new'
        >
          <AddIcon />
        </Button>
        <TournamentCardList />
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
};

export default withStyles(styles, { withTheme: true })(Home);
