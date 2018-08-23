import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { withNotification } from '../components/Notification';
import AppMenu from '../components/AppMenu';
import TournamentSettings from '../components/TournamentSettings';

const NotifiedTournamentSettings = withNotification(TournamentSettings);

const styles = theme => ({
  actionButton: {
    margin: 2 * theme.spacing.unit,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

class NewTournament extends Component {
  handleTournamentCreated = (tournament) => {
    this.props.history.push(`/tournament/${tournament.id}`);
  };

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div>
        <AppMenu title='Point Pods' />
        <NotifiedTournamentSettings {...rest}
          title='New Tournament'
          onSubmit={this.handleTournamentCreated}
        />
      </div>
    );
  }
}

NewTournament.defaultProps = {
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

NewTournament.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object, // added by parent
  match: PropTypes.object, // added by parent
};

export default withStyles(styles, { withTheme: true })(NewTournament);
