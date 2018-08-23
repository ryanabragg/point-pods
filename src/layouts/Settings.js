import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import AppMenu from '../components/AppMenu';
import AppSettings from '../components/AppSettings';

const styles = theme => ({});

class Settings extends Component {
  goBack = () => {
    this.props.history.go(-1);
  };

  render() {
    return (
      <div>
        <AppMenu title='Settings' usesBackIcon onBack={this.goBack} />
        <AppSettings />
      </div>
    );
  }
}

Settings.defaultProps = {
  history: {
    push: () => null,
    replace: () => null,
  },
};

Settings.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object, // added by parent
};

export default withStyles(styles, { withTheme: true })(Settings);
