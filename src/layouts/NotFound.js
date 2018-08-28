import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import AppMenu from '../components/AppMenu';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    maxWidth: theme.breakpoints.values.sm,
  },
  media: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  icon: {
    position: 'absolute',
  },
  red: {
    color: theme.palette.error.main,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
});

class NotFound extends Component {
  render() {
    const { classes, history, notification } = this.props;
    return (
      <div className={classes.root}>
        <AppMenu title='Point Pods'
          history={history}
          notification={notification}
        />
        <Card className={classes.card}>
          <CardMedia className={classes.media}>
            <ErrorOutlineIcon
              color='primary'
              className={classNames(classes.media, classes.icon)}
            />
          </CardMedia>
          <CardContent className={classes.content}>
            <Typography color='primary' variant='headline'>
              Awkward.
            </Typography>
            <Typography variant='subheading'>
              One of us messed up somewhere.
            </Typography>
            <Typography>
              I suggest the menu or back button, and coffee.
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }
}

NotFound.defaultProps = {
  history: {
    go: () => null,
    push: () => null,
    replace: () => null,
  },
  notification: (m, v, d, c) => null,
};

NotFound.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object, // added by parent Route
  notification: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(NotFound);
