import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';

import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';

const NotificationContext = React.createContext();

function withNotification(Component) {
  return function NotificationEnabledComponent(props) {
    return (
      <NotificationContext.Consumer>
        {context => <Component {...props} notification={context} />}
      </NotificationContext.Consumer>
    );
  };
}

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

class Notification extends React.Component {
  state = {
    open: false,
    notification: {},
  };

  queue = [];

  icons = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
  };

  handleClose = (event, reason) => {
    if(reason === 'clickaway')
      return;
    this.setState({ open: false });
    if(typeof this.state.notification.onClose === 'function')
      this.state.notification.onClose();
  };

  processQueue = () => {
    if (this.queue.length > 0) {
      this.setState({
        notification: this.queue.shift(),
        open: true,
      });
    }
  };

  handleExited = () => {
    this.processQueue();
  };

  addNotification = (message = '', variant = 'info', duration = 6000, onClose = null) => {
    return new Promise((resolve, reject) => {
      const notice = {
        key: new Date().getTime(),
        variant: [
          'success',
          'warning',
          'error',
          'info'
        ].includes(variant) ? variant : 'info',
        message: message,
        duration: duration || null,
        onClose: onClose,
      };
      this.queue.push(notice);
      if (this.state.open) {
        this.setState({ open: false });
      } else {
        this.processQueue();
      }
      resolve(notice);
    });
  }

  render() {
    const { classes, children, ...other } = this.props;
    const { key, variant, message, duration } = this.state.notification;
    const Icon = this.icons[variant || 'info'];

    return (
      <React.Fragment>
        <NotificationContext.Provider value={this.addNotification}>
          {children}
        </NotificationContext.Provider>
        <Snackbar
          key={key}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.open}
          autoHideDuration={duration || null}
          onClose={this.handleClose}
          onExited={this.handleExited}
        >
          <SnackbarContent
            className={classNames(classes[variant], classes.margin)}
            aria-describedby="notification-snackbar"
            message={
              <span id="notification-snackbar" className={classes.message}>
                <Icon className={classNames(classes.icon, classes.iconVariant)} />
                {message}
              </span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleClose}
              >
                <CloseIcon className={classes.icon} />
              </IconButton>,
            ]}
            {...other}
          />
        </Snackbar>
      </React.Fragment>
    );
  }
}

Notification.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Notification);
export { NotificationContext, withNotification };
