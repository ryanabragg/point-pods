import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxIcon from '@material-ui/icons/AddBox';
import BallotIcon from '@material-ui/icons/Ballot';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/SettingsSharp';

const styles = theme => ({
  root: {
    width: '100%',
  },
  flex: {
    flexGrow: 1,
    flexShrink: 0,
    marginRight: theme.spacing.unit,
  },
  nowrap: {
    flexWrap: 'nowrap',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  list: {
    width: 250,
  },
  spacer: {
    height: `${64 + 2 * theme.spacing.unit}px`,
    [theme.breakpoints.down('xs')]: {
      height: `${56 + 2 * theme.spacing.unit}px`,
    },
  },
  pad: {
    height: `${2 * theme.spacing.unit}px`,
  },
});

class AppMenu extends React.Component {
  state = {
    drawerOpen: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if(this.props.usesBackIcon && this.props.usesBackIcon !== prevProps.usesBackIcon)
      this.setState({ drawerOpen: false });
  }

  toggleDrawer = (open) => () => {
    this.setState({
      drawerOpen: open,
    });
  };

  render() {
    const { classes, theme, position, color, title, toolbar, usesBackIcon } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position={position} color={color}>
          <Toolbar className={classes.nowrap}>
            {usesBackIcon
              ? (
                <IconButton
                  aria-label='Back'
                  color='inherit'
                  className={classes.menuButton}
                  onClick={this.props.onBack}
                >
                  <ArrowBackIcon />
                </IconButton>
              ) : (
                <IconButton
                  aria-label='Menu'
                  color='inherit'
                  className={classes.menuButton}
                  onClick={this.toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
              )
            }
            <Typography variant='title' color='inherit' className={classes.flex}>
              {title}
            </Typography>
            {toolbar}
          </Toolbar>
        </AppBar>
        {(position === 'fixed' || position === 'absolute')
          ? <div className={classes.spacer} />
          : <div className={classes.pad} />
        }
        <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawer(false)}>
          <div
            tabIndex={0}
            role='button'
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            <div className={classes.list}>
              <AppBar position='static'>
                <Toolbar>
                  <IconButton className={classes.menuButton} color='inherit' aria-label='Menu-Close'>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                  </IconButton>
                  <Typography variant='title' color='inherit'>
                    Menu
                  </Typography>
                </Toolbar>
              </AppBar>
              <List>
                <ListItem button component='a' href='/'>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary='Home' />
                </ListItem>
                <ListItem button component='a' href='/new'>
                  <ListItemIcon>
                    <AddBoxIcon />
                  </ListItemIcon>
                  <ListItemText primary='New Tournament' />
                </ListItem>
                <ListItem button component='a' href='/tournaments'>
                  <ListItemIcon>
                    <BallotIcon />
                  </ListItemIcon>
                  <ListItemText primary='Tournaments' />
                </ListItem>
                <ListItem button component='a' href='/players'>
                  <ListItemIcon>
                    <PeopleIcon />
                  </ListItemIcon>
                  <ListItemText primary='Players' />
                </ListItem>
              </List>
              <Divider />
              <List>
                <ListItem button component='a' href='/settings'>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary='Settings' />
                </ListItem>
              </List>
            </div>
          </div>
        </Drawer>
      </div>
    );
  }
}

AppMenu.defaultProps = {
  position: 'fixed',
  color: 'primary',
  title: 'Point Pods',
  toolbar: null,
  usesBackIcon: false,
  onBack: () => null,
};

AppMenu.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  position: PropTypes.oneOf(['static', 'fixed']),
  color: PropTypes.string,
  title: PropTypes.string,
  toolbar: PropTypes.element,
  usesBackIcon: PropTypes.bool,
  onBack: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(AppMenu);
