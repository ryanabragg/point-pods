import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    maxWidth: theme.breakpoints.values['sm'],
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
  field: {
    minWidth: 250,
  },
});

class AppSettings extends Component {
  state = {
    pairingMethod: '',
    pairingMethodInitial: '',
    podSizeMinimum: '',
    podSizeMaximum: '',
    pairingMethods: [],
  };

  componentDidMount() {
    let loadState = {
      pairingMethods: Object.keys(this.props.api.pairingMethods)
        .map(key => ({
          label: key.slice(0,1).toUpperCase() + key.slice(1).toLowerCase(),
          value: this.props.api.pairingMethods[key],
        })),
    };
    this.props.api.Settings.get()
      .then((settings) => Object.assign(loadState, settings))
      .then(() => this.setState(loadState))
      .catch(error => this.props.notification(error.message, 'error'));
  }

  handleInputChange = name => event => {
    const value = event.target.value;
    this.props.api.Settings.set({ [name]: value })
      .then(settings => this.setState(settings))
      .catch(error => this.props.notification(error.message, 'error'));
  };

  render() {
    const { classes } = this.props;
    const {
      pairingMethod,
      pairingMethodInitial,
      podSizeMinimum,
      podSizeMaximum,
      pairingMethods,
    } = this.state;
    return (
      <Card className={classes.root}>
        <CardHeader
          title='Pod Setup'
        />
        <Divider />
        <CardContent className={classes.content}>
          <TextField className={classes.field}
            margin="dense"
            id="settings-pairingMethod"
            label="Pairing Method"
            type="text"
            value={pairingMethod}
            onChange={this.handleInputChange('pairingMethod')}
            select
          >
            {pairingMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </TextField>
          <TextField className={classes.field}
            margin="dense"
            id="settings-pairingMethodInitial"
            label="Initial Pairing Method"
            type="text"
            value={pairingMethodInitial}
            onChange={this.handleInputChange('pairingMethodInitial')}
            select
          >
            {pairingMethods.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </TextField>
          <TextField className={classes.field}
            margin="dense"
            id="settings-podSizeMinimum"
            label="Minimum Pod Size"
            type="number"
            value={podSizeMinimum}
            onChange={this.handleInputChange('podSizeMinimum')}
          />
          <TextField className={classes.field}
            margin="dense"
            id="settings-podSizeMaximum"
            label="Maximum Pod Size"
            type="number"
            value={podSizeMaximum}
            onChange={this.handleInputChange('podSizeMaximum')}
          />
        </CardContent>
      </Card>
    );
  }
}

AppSettings.defaultProps = {
  notification: (message, variant, duration, onClose) => null,
};

AppSettings.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  notification: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(withAPI(AppSettings));
