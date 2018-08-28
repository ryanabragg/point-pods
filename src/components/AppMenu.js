import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HomeIcon from '@material-ui/icons/Home';
import AddBoxIcon from '@material-ui/icons/AddBox';
import BallotIcon from '@material-ui/icons/Ballot';
import PeopleIcon from '@material-ui/icons/People';
import SettingsIcon from '@material-ui/icons/SettingsSharp';

import TournamentSettings from '../components/TournamentSettings';

const styles = theme => ({
  root: {
    width: '100%',
  },
  flex: {
    flexGrow: 1,
    flexShrink: 1,
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
  right: {
    marginLeft: 'auto',
  },
});

class AppMenu extends React.Component {
  state = {
    drawerOpen: false,
    dialogOpen: false,
    categories: [],
    pairingMethods: [],
    name: '',
    category: '',
    description: '',
    date: '',
    pairingMethod: 0,
    pairingMethodInitial: 0,
    podSizeMinimum: 0,
    podSizeMaximum: 0,
  };

  defaultSettings = {
    name: '',
    category: '',
    description: '',
    date: '',
    pairingMethod: 0,
    pairingMethodInitial: 0,
    podSizeMinimum: 0,
    podSizeMaximum: 0,
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
      .then((settings) => {
        Object.assign(this.defaultSettings, settings);
        Object.assign(loadState, settings);
      })
      .then(() => this.props.api.Tournaments.all())
      .then(list => {
        Object.assign(loadState, {
          tournaments: list,
          categories: list.map(tournament => tournament.category)
            .filter((cat, i, self) => cat && self.indexOf(cat) === i).sort(),
        });
      })
      .then(() => this.setState(loadState))
      .catch(error => this.props.notification(error.message, 'error'));
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.usesBackIcon && this.props.usesBackIcon !== prevProps.usesBackIcon)
      this.setState({ drawerOpen: false });
  }

  setValue = (key, value) => {
    this.setState({[key]: value});
  };

  handleUpdateValue = (key, value) => () => {
    this.setState({[key]: value});
  };

  handleCreateTournament = () => {
    if(this.state.name === '')
      return this.props.notification('Name cannot be empty', 'error');
    if(this.state.podSizeMinimum > this.state.podSizeMaximum)
      return this.props.notification('Minimum pod size exceeds maximum', 'error');
    this.props.api.Tournaments.set({
      name: this.state.name,
      category: this.state.category,
      description: this.state.description,
      date: this.state.date,
      pairingMethod: this.state.pairingMethod,
      pairingMethodInitial: this.state.pairingMethodInitial,
      podSizeMinimum: this.state.podSizeMinimum,
      podSizeMaximum: this.state.podSizeMaximum,
    })
      .then(tournament => this.props.history.push(`/tournament/${tournament.id}`))
      .catch(error => this.props.notification(error.message, 'error'));
  };

  handleCloseModal = () => {
    this.setState(Object.assign({}, this.defaultSettings, { dialogOpen: false }));
    this.props.onCancelNew();
  };

  render() {
    const {
      classes,
      theme,
      position,
      color,
      title,
      toolbar,
      usesBackIcon,
      showNew
    } = this.props;
    const {
      drawerOpen,
      dialogOpen,
      categories,
      pairingMethods,
      name,
      category,
      description,
      date,
      pairingMethod,
      pairingMethodInitial,
      podSizeMinimum,
      podSizeMaximum
    } = this.state;

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
                  onClick={this.handleUpdateValue('drawerOpen', true)}
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
        <Drawer open={drawerOpen} onClose={this.handleUpdateValue('drawerOpen', false)}>
          <div className={classes.list}>
            <AppBar position='static'>
              <Toolbar>
                <IconButton className={classes.menuButton}
                  color='inherit'
                  aria-label='Menu-Close'
                  tabIndex={0}
                  onClick={this.handleUpdateValue('drawerOpen', false)}
                >
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
              <ListItem button component='a' onClick={this.handleUpdateValue('dialogOpen', true)}>
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
        </Drawer>
        <Dialog
          open={dialogOpen || showNew}
          onClose={this.handleCloseModal}
          aria-labelledby='new-tournament-dialog'
          scroll='body'
        >
          <DialogTitle id='new-tournament-dialog'>New Tournament</DialogTitle>
          <DialogContent>
            <TournamentSettings
              pairingMethods={pairingMethods}
              categories={categories}
              name={name}
              category={category}
              description={description}
              date={date}
              pairingMethod={pairingMethod}
              pairingMethodInitial={pairingMethodInitial}
              podSizeMinimum={podSizeMinimum}
              podSizeMaximum={podSizeMaximum}
              onChange={this.setValue}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              color='primary'
              onClick={this.handleCloseModal}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              onClick={this.handleCreateTournament}
              className={classes.right}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AppMenu.defaultProps = {
  history: {
    go: () => null,
    push: () => null,
    replace: () => null,
  },
  notification: (m, v, d, c) => null,
  position: 'fixed',
  color: 'primary',
  title: 'Point Pods',
  toolbar: null,
  usesBackIcon: false,
  onBack: () => null,
  showNew: false,
  onCancelNew: () => null,
};

AppMenu.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  history: PropTypes.object.isRequired,
  notification: PropTypes.func,
  position: PropTypes.oneOf(['static', 'fixed']),
  color: PropTypes.string,
  title: PropTypes.string,
  toolbar: PropTypes.element,
  usesBackIcon: PropTypes.bool,
  onBack: PropTypes.func,
  showNew: PropTypes.bool,
  onCancelNew: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(withAPI(AppMenu));
