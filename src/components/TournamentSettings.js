import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import Select from './Select';

import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  root: {
    margin: theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    minHeight: 400,
  },
  card: {
    overflow: 'visible',
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
    createdCategories: [],
  };

  updateValues = {};

  componentWillUnmount() {
    if(this.timeout)
      clearTimeout(this.timeout);
    this.timeout = null;
    this.props.sync(false);
  }

  update = () => {
    this.props.onChange(this.updateValues);
    this.updateValues = {};
  };

  handleInputChange = name => event => {
    let val = typeof this.props[name] === 'number'
      ? Number(event.target.value)
      : event.target.value;
    this.props.sync(true);
    if(this.props.immediate)
      return this.props.onChange(name, val);
    Object.assign(this.updateValues, {
      [name]: val,
    });
    if(this.timeout)
      clearTimeout(this.timeout);
    this.timeout = setTimeout(this.update, 2000);
  };

  handleSelectValue = name => (selected, action) => {
    if(selected === null)
      selected = {value: ''};
    let val = typeof this.props[name] === 'number'
      ? Number(selected.value)
      : selected.value;
    this.props.sync(true);
    if(this.props.immediate)
      return this.props.onChange(name, val);
    Object.assign(this.updateValues, {
      [name]: val,
    });
    if(this.timeout)
      clearTimeout(this.timeout);
    this.timeout = setTimeout(this.update, 2000);
  };

  handleSelectCreateValue = (name, list) => value => {
    let val = typeof this.props[name] === 'number'
      ? Number(value)
      : value;
    this.setState((prevState, props) => ({
      [list]: [
        ...prevState[list],
        val,
      ],
    }));
    this.props.sync(true);
    if(this.props.immediate)
      return this.props.onChange(name, val);
    Object.assign(this.updateValues, {
      [name]: val,
    });
    if(this.timeout)
      clearTimeout(this.timeout);
    this.timeout = setTimeout(this.update, 2000);
  };

  render() {
    const {
      children,
      classes,
      title,
      autoFocus,
      pairingMethods,
      categories,
      name,
      category,
      description,
      date,
      pairingMethod,
      pairingMethodInitial,
      podSizeMinimum,
      podSizeMaximum
    } = this.props;
    const { createdCategories } = this.state;
    const allCategories = [
      ...categories,
      ...createdCategories
    ].sort((a, b) => {
      let left = a.toLowerCase();
      let right = b.toLowerCase();
      return left > right ? 1 : left < right ? -1 : 0;
    }).map(c => ({label: c, value: c}));
    const selectValues = {
      filterCategory: allCategories.filter(c => c.value === category),
      filterPairingMethod: pairingMethods.filter(m => m.value === pairingMethod),
      filterPairingMethodInitial: pairingMethods.filter(m => m.value === pairingMethodInitial),
      category: '',
      pairingMethod: null,
      pairingMethodInitial: null,
    };
    if(selectValues.filterCategory.length)
      selectValues.category = selectValues.filterCategory[0];
    if(selectValues.filterPairingMethod.length)
      selectValues.pairingMethod = selectValues.filterPairingMethod[0];
    if(selectValues.filterPairingMethodInitial.length)
      selectValues.pairingMethodInitial = selectValues.filterPairingMethodInitial[0];
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          {title && <CardHeader title={title} />}
          {title && <Divider />}
          <CardContent className={classes.content}>
            <TextField className={classes.field}
              autoFocus={autoFocus}
              margin='normal'
              id='tournament-name'
              label=' Name'
              type='text'
              required
              defaultValue={name}
              onChange={this.handleInputChange('name')}
              fullWidth
            />
            <TextField className={classes.field}
              margin='normal'
              id='tournament-description'
              label='Description'
              type='text'
              required
              defaultValue={description}
              onChange={this.handleInputChange('description')}
              fullWidth
            />
            <Select className={classes.field}
              margin='normal'
              id='tournament-category'
              label='Category'
              type='text'
              isClearable
              isCreatable
              placeholder='Select or Type...'
              value={selectValues.category}
              onChange={this.handleSelectValue('category')}
              options={allCategories}
              onCreateOption={this.handleSelectCreateValue('category', 'createdCategories')}
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
            />
            <TextField className={classes.field}
              margin='normal'
              id='tournament-date'
              label='Date'
              type='date'
              required
              defaultValue={date}
              onChange={this.handleInputChange('date')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Select className={classes.field}
              margin='normal'
              id='tournament-pairingMethod'
              label='Pairing Method'
              type='text'
              backspaceRemovesValue={false}
              value={selectValues.pairingMethod}
              onChange={this.handleSelectValue('pairingMethod')}
              options={pairingMethods}
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
            />
            <Select className={classes.field}
              margin='normal'
              id='tournament-pairingMethodInitial'
              label='Initial Pairing Method'
              type='text'
              backspaceRemovesValue={false}
              value={selectValues.pairingMethodInitial}
              onChange={this.handleSelectValue('pairingMethodInitial')}
              options={pairingMethods}
              getOptionLabel={option => option.label}
              getOptionValue={option => option.value}
            />
            <TextField className={classes.field}
              margin='normal'
              id='tournament-podSizeMinimum'
              label='Minimum Pod Size'
              type='number'
              required
              defaultValue={podSizeMinimum}
              onChange={this.handleInputChange('podSizeMinimum')}
            />
            <TextField className={classes.field}
              margin='normal'
              id='tournament-podSizeMaximum'
              label='Maximum Pod Size'
              type='number'
              required
              defaultValue={podSizeMaximum}
              onChange={this.handleInputChange('podSizeMaximum')}
            />
          </CardContent>
          <Divider />
          <CardActions>
            {children}
          </CardActions>
        </Card>
      </div>
    );
  }
}

TournamentSettings.defaultProps = {
  title: '',
  autoFocus: false,
  pairingMethods: [],
  categories: [],
  name: '',
  category: '',
  description: '',
  date: '',
  pairingMethod: 0,
  pairingMethodInitial: 0,
  podSizeMinimum: 0,
  podSizeMaximum: 0,
  onChange: (updateValues) => null,
  immediate: false,
  sync: bool => null,
};

TournamentSettings.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
  title: PropTypes.string,
  autoFocus: PropTypes.bool,
  pairingMethods: PropTypes.array,
  categories: PropTypes.array,
  name: PropTypes.string,
  category: PropTypes.string,
  description: PropTypes.string,
  date: PropTypes.string,
  pairingMethod: PropTypes.number,
  pairingMethodInitial: PropTypes.number,
  podSizeMinimum: PropTypes.number,
  podSizeMaximum: PropTypes.number,
  onChange: PropTypes.func,
  immediate: PropTypes.bool,
  sync: PropTypes.func,
};

export default withStyles(styles, { withTheme: true })(TournamentSettings);
