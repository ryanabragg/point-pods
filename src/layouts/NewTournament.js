import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';

import SendIcon from '@material-ui/icons/Send';

import { withNotification } from '../components/Notification';
import AppMenu from '../components/AppMenu';
import TournamentSettings from '../components/TournamentSettings';
import TournamentParticipants from '../components/TournamentParticipants';

const NotifiedTournamentSettings = withNotification(TournamentSettings);
const NotifiedTournamentParticipants = withNotification(TournamentParticipants);

const styles = theme => ({
  actionButton: {
    margin: 2 * theme.spacing.unit,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  center: {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, 0)',
  },
});

class NewTournament extends Component {
  state = {
    id: this.props.match.params.id || null,
  };

  handleTournamentCreated = (tournament) => {
    this.setState({ id: tournament.id });
  };

  render() {
    const { classes, ...rest } = this.props;
    const { id } = this.state;
    return (
      <div>
        <AppMenu title='Point Pods' />
        {id === null
          ? (
            <div className={classes.center}>
              <NotifiedTournamentSettings {...rest}
                onSubmit={this.handleTournamentCreated}
              />
            </div>
          ) : (
            <React.Fragment>
              <Button
                variant='fab'
                color='secondary'
                aria-label='Start Tournament'
                className={classes.actionButton}
                href={`/tournament/${this.state.id}`}
              >
                <SendIcon />
              </Button>
              <NotifiedTournamentParticipants {...rest} id={id} />
            </React.Fragment>
          )
        }
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
