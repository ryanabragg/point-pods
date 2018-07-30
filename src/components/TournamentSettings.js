import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { withAPI } from '../api';

import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

import AddIcon from '@material-ui/icons/Add';

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
  right: {
    marginLeft: 'auto',
  },
});

class TournamentSettings extends Component {
  state = {
    name: '',
    category: '',
    description: '',
    date: new Date().toJSON().slice(0,10),
    pairingMethod: '',
    pairingMethodInitial: '',
    podSizeMinimum: '',
    podSizeMaximum: '',
    pairingMethods: [],
    categories: [],
    newCategory: '',
  };

  componentDidMount() {
    let loadState = {};
    this.props.api.Settings.get()
      .then(({
        pairingMethod,
        pairingMethodInitial,
        podSizeMinimum,
        podSizeMaximum
      }) => {
        let methodsArray = Object.keys(this.props.api.pairingMethods)
          .map(key => ({
            label: key.slice(0,1).toUpperCase() + key.slice(1).toLowerCase(),
            value: this.props.api.pairingMethods[key]
          }));
        loadState.pairingMethod = pairingMethod;
        loadState.pairingMethodInitial = pairingMethodInitial;
        loadState.podSizeMinimum = podSizeMinimum;
        loadState.podSizeMaximum = podSizeMaximum;
        loadState.pairingMethods = methodsArray;
      })
      .then(() => this.props.api.Tournaments.all())
      .then(list => loadState.categories = list
          .map(tournament => tournament.category)
          .filter((cat, i, self) => cat && self.indexOf(cat) === i).sort())
      .then(() => this.setState(loadState))
      .catch(error => this.props.notification(error.message, 'error'));
  }

  handleInputChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleAddCategory = () => {
    if(!this.state.newCategory)
      return;
    this.setState((prevState, props) => {
      return {
        category: prevState.newCategory,
        categories: prevState.categories.concat(prevState.newCategory),
        newCategory: '',
      };
    });
  };

  handleSubmit = () => {
    if(!this.state.name)
      return;
    const values = Object.assign({}, this.state);
    delete values.pairingMethods;
    delete values.categories;
    delete values.newCategory;
    this.props.api.Tournaments.set(values)
      .then(tournament => {
        if(typeof this.props.onSubmit === 'function')
          this.props.onSubmit(tournament);
      })
      .catch(error => this.props.notification(error.message, 'error'));
  };

  render() {
    const { classes } = this.props;
    const {
      name,
      category,
      description,
      date,
      pairingMethod,
      pairingMethodInitial,
      podSizeMinimum,
      podSizeMaximum,
      pairingMethods,
      categories,
      newCategory
    } = this.state;
    return (
      <Card className={classes.root}>
        <CardHeader
          title={'New Tournament'}
        />
        <Divider />
        <CardContent className={classes.content}>
          <TextField className={classes.field}
            autoFocus
            margin="dense"
            id="tournament-name"
            label=" Name"
            type="text"
            value={name}
            onChange={this.handleInputChange('name')}
            fullWidth
          />
          <TextField className={classes.field}
            margin="dense"
            id="tournament-description"
            label="Description"
            type="text"
            value={description}
            onChange={this.handleInputChange('description')}
            fullWidth
          />
          <TextField className={classes.field}
            margin="dense"
            id="tournament-category"
            label="Category"
            type="text"
            value={category}
            onChange={this.handleInputChange('category')}
            select
          >
            {categories.map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </TextField>
          <TextField className={classes.field}
            margin="dense"
            id="tournament-date"
            label="Date"
            type="date"
            value={date}
            onChange={this.handleInputChange('date')}
          />
          <TextField className={classes.field}
            margin="dense"
            id="tournament-pairingMethod"
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
            id="tournament-pairingMethodInitial"
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
            id="tournament-podSizeMinimum"
            label="Minimum Pod Size"
            type="number"
            value={podSizeMinimum}
            onChange={this.handleInputChange('podSizeMinimum')}
          />
          <TextField className={classes.field}
            margin="dense"
            id="tournament-podSizeMaximum"
            label="Maximum Pod Size"
            type="number"
            value={podSizeMaximum}
            onChange={this.handleInputChange('podSizeMaximum')}
          />
        </CardContent>
        <Divider />
        <CardActions>
          <TextField
            margin="dense"
            id="tournament-newCategory"
            label="Add Category"
            type="text"
            value={newCategory}
            onChange={this.handleInputChange('newCategory')}
          />
          <IconButton
            id='tournament-newCategory-add'
            onClick={this.handleAddCategory}
          >
            <AddIcon />
          </IconButton>
          <Button className={classes.right}
            id='tournament-create'
            onClick={this.handleSubmit}
          >
            Create
          </Button>
        </CardActions>
      </Card>
    );
  }
}

TournamentSettings.defaultProps = {
  onSubmit: (tournament) => null,
  notification: (message, variant, duration, onClose) => null,
};

TournamentSettings.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  onSubmit: PropTypes.func,
  notification: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(withAPI(TournamentSettings));
