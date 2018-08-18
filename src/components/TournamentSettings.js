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
    id: null,
    name: '',
    category: '',
    description: '',
    date: new Date().toJSON().slice(0,10),
    pairingMethod: '',
    pairingMethodInitial: '',
    podSizeMinimum: 0,
    podSizeMaximum: 0,
    pairingMethods: [],
    categories: [],
    newCategory: '',
  };

  componentDidMount() {
    let loadState = {};
    this.props.api.Tournaments.all()
      .then(list => {
        Object.assign(loadState, {
          pairingMethods: Object.keys(this.props.api.pairingMethods)
            .map(key => ({
              label: key.slice(0,1).toUpperCase() + key.slice(1).toLowerCase(),
              value: this.props.api.pairingMethods[key],
            })),
          categories: list.map(tournament => tournament.category)
            .filter((cat, i, self) => cat && self.indexOf(cat) === i).sort(),
        });
        if(!this.props.id)
          return this.props.api.Settings.get()
            .then((settings) => Object.assign(loadState, settings));
        let found = list.filter(t => t.id === this.props.id);
        if(!found.length)
          throw new Error('ID not found');
        Object.assign(loadState, found[0]);
      })
      .then(() => this.setState(loadState))
      .catch(error => this.props.notification(error.message, 'error'));
  }

  handleInputChange = name => event => {
    let value = event.target.type === 'number'
      ? Number(event.target.value)
      : event.target.value;
    this.setState({
      [name]: value,
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
    if(values.id === null)
      delete values.id;
    this.props.api.Tournaments.set(values)
      .then(tournament => {
        if(typeof this.props.onSubmit === 'function')
          this.props.onSubmit(tournament);
      })
      .catch(error => this.props.notification(error.message, 'error'));
  };

  render() {
    const { classes, title, autoFocus } = this.props;
    const {
      id,
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
          title={title}
        />
        <Divider />
        <CardContent className={classes.content}>
          <TextField className={classes.field}
            autoFocus={autoFocus}
            margin='dense'
            id='tournament-name'
            label=' Name'
            type='text'
            value={name}
            onChange={this.handleInputChange('name')}
            fullWidth
          />
          <TextField className={classes.field}
            margin='dense'
            id='tournament-description'
            label='Description'
            type='text'
            value={description}
            onChange={this.handleInputChange('description')}
            fullWidth
          />
          <TextField className={classes.field}
            margin='dense'
            id='tournament-category'
            label='Category'
            type='text'
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
            margin='dense'
            id='tournament-date'
            label='Date'
            type='date'
            value={date}
            onChange={this.handleInputChange('date')}
          />
          <TextField className={classes.field}
            margin='dense'
            id='tournament-pairingMethod'
            label='Pairing Method'
            type='text'
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
            margin='dense'
            id='tournament-pairingMethodInitial'
            label='Initial Pairing Method'
            type='text'
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
            margin='dense'
            id='tournament-podSizeMinimum'
            label='Minimum Pod Size'
            type='number'
            value={podSizeMinimum}
            onChange={this.handleInputChange('podSizeMinimum')}
          />
          <TextField className={classes.field}
            margin='dense'
            id='tournament-podSizeMaximum'
            label='Maximum Pod Size'
            type='number'
            value={podSizeMaximum}
            onChange={this.handleInputChange('podSizeMaximum')}
          />
        </CardContent>
        <Divider />
        <CardActions>
          <TextField
            margin='dense'
            id='tournament-newCategory'
            label='Add Category'
            type='text'
            value={newCategory}
            onChange={this.handleInputChange('newCategory')}
          />
          <IconButton
            id='tournament-newCategory-add'
            aria-label='Add Category'
            onClick={this.handleAddCategory}
          >
            <AddIcon />
          </IconButton>
          <Button className={classes.right}
            id='tournament-submit'
            aria-label={id ? 'Save' : 'Create'}
            onClick={this.handleSubmit}
          >
            {id ? 'Save' : 'Create'}
          </Button>
        </CardActions>
      </Card>
    );
  }
}

TournamentSettings.defaultProps = {
  notification: (message, variant, duration, onClose) => null,
  title: 'New Tournament',
  id: null,
  onSubmit: (tournament) => null,
  autoFocus: false,
};

TournamentSettings.propTypes = {
  api: PropTypes.object.isRequired, // added by withAPI
  classes: PropTypes.object.isRequired, // added by withStyles
  notification: PropTypes.func,
  title: PropTypes.string,
  id: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  onSubmit: PropTypes.func,
  autoFocus: PropTypes.bool,
};

export default withStyles(styles, { withTheme: true })(withAPI(TournamentSettings));
