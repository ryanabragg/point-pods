import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import DeleteIcon from '@material-ui/icons/Delete';
import SyncIcon from '@material-ui/icons/Sync';

import AppMenu from '../components/AppMenu';
import MenuButton from '../components/MenuButton';
import SwipeTabControl from '../components/SwipeTabControl';
import TournamentCards from '../components/TournamentCards';

const styles = theme => ({
  root: {
    maxWidth: theme.breakpoints.values['sm'],
  },
  actionButton: {
    margin: 2 * theme.spacing.unit,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  points: {
    margin: theme.spacing.unit,
  },
  content: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
  },
  cardContent: {
    padding: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  field: {
    minWidth: 250,
  },
  right: {
    marginLeft: 'auto',
  },
  spinning: {
    'animation-name': 'basic-spin',
    'animation-duration': '4s',
    'animation-iteration-count': 'infinite',
  },
  '@keyframes basic-spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(-360deg)',
    },
  },
});

class Player extends Component {
  state = {
    id: this.props.match.params.id,
    name: '',
    points: 0,
  };

  tournaments = [];

  componentDidMount() {
    let nextState;
    this.props.api.Players.get(this.state.id)
      .then(player => nextState = player)
      .then(() => this.props.api.Tournaments.all())
      .then(list => this.tournaments = list.filter(t =>
        -1 < t.players.findIndex(p => p.id === nextState.id)
      ))
      .then(() => this.setState(nextState))
      .catch(error => {
        this.props.notification(error.message, 'error');
        this.goBack();
      });
  }

  onInputChange = name => event => {
    const value = event.target.value;
    this.setState({[name]: value});
    if(this.handleSync)
      clearTimeout(this.handleSync);
    this.handleSync = setTimeout(() => {
      this.props.api.Players.set(this.state)
        .then(player => {
          this.handleSync = null;
          this.forceUpdate();
        })
        .catch(error => this.props.notification(error.message, 'error'));
    }, 2000);
  };

  goBack = () => {
    this.props.history.go(-1);
  };

  delete = () => {
    if(this.tournaments.length) {
      this.props.notification('Unable to remove: player was in a tournament', 'error');
      return;
    }
    this.props.api.Players.remove(this.state.id)
      .then(player => {
        this.props.notification(`Deleted player ${this.state.name}`, 'info');
        this.props.history.push('/players');
      })
      .catch(error => this.props.notification(error.message, 'error'));
  };

  renderToolbar = () => {
    return (
      <React.Fragment>
        <span className={this.props.classes.points}>
          {`${this.state.points} Points`}
        </span>
        <MenuButton
          buttonType='icon'
          buttonProps={{color: 'inherit'}}
          buttonContent={<MoreVertIcon />}
          menuItems={[{
            label: 'Delete',
            icon: <DeleteIcon />,
            action: this.delete,
          }]}
        />
      </React.Fragment>
    );
  };

  render() {
    const { classes } = this.props;
    const { id, name, points } = this.state;
    return (
      <div>
        <AppMenu title={name}
          usesBackIcon onBack={this.goBack}
          toolbar={this.renderToolbar()}
        />
        <SwipeTabControl
          tabs={[
            {key: 1, label: 'Attendance'},
            {key: 2, label: 'Edit'},
          ]}
        >
          <TournamentCards displayOnly tournaments={this.tournaments} />
          <div className={classes.content}>
            <Card className={classes.root}>
              <CardHeader
                title='Details'
                action={this.handleSync && <SyncIcon className={classes.spinning} color='primary' />}
              />
              <Divider />
              <CardContent className={classes.cardContent}>
                <TextField className={classes.field}
                  margin='dense'
                  id='player-name'
                  label='Name'
                  type='text'
                  value={name}
                  onChange={this.onInputChange('name')}
                />
              </CardContent>
            </Card>
          </div>
        </SwipeTabControl>
      </div>
    );
  }
}

Player.defaultProps = {
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

Player.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object, // added by parent Route
  match: PropTypes.object, // added by parent Route
  notification: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(withAPI(Player));
