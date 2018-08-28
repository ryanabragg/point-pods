import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';

import Select from './Select';

const styles = theme => ({
  root: {
    padding: 2 * theme.spacing.unit,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    minHeight: 540,
  },
  field: {
    minWidth: 250,
  },
});

class TournamentSettings extends Component {
  state = {
    createdCategories: [],
  };

  handleInputChange = name => event => {
    let val = typeof this.props[name] === 'number'
      ? Number(event.target.value)
      : event.target.value;
    this.props.onChange(name, val);
  };

  handleSelectValue = name => (selected, action) => {
    if(selected === null)
      selected = {value: ''};
    let val = typeof this.props[name] === 'number'
      ? Number(selected.value)
      : selected.value;
    this.props.onChange(name, val);
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
    this.props.onChange(name, val);
  };

  render() {
    const {
      classes,
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
      ...createdCategories.filter(cat => !categories.includes(cat))
    ].filter(cat => cat && cat.length).sort((a, b) => {
      if(!a || !b)
        return 0;
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
        <TextField className={classes.field}
          autoFocus={autoFocus}
          margin='dense'
          id='tournament-name'
          label=' Name'
          type='text'
          required
          value={name}
          onChange={this.handleInputChange('name')}
          fullWidth
        />
        <TextField className={classes.field}
          margin='dense'
          id='tournament-description'
          label='Description'
          type='text'
          required
          value={description}
          onChange={this.handleInputChange('description')}
          fullWidth
        />
        <Select className={classes.field}
          margin='dense'
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
          margin='dense'
          id='tournament-date'
          label='Date'
          type='date'
          required
          value={date}
          onChange={this.handleInputChange('date')}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Select className={classes.field}
          margin='dense'
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
          margin='dense'
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
          margin='dense'
          id='tournament-podSizeMinimum'
          label='Minimum Pod Size'
          type='number'
          required
          value={podSizeMinimum}
          onChange={this.handleInputChange('podSizeMinimum')}
        />
        <TextField className={classes.field}
          margin='dense'
          id='tournament-podSizeMaximum'
          label='Maximum Pod Size'
          type='number'
          required
          value={podSizeMaximum}
          onChange={this.handleInputChange('podSizeMaximum')}
        />
      </div>
    );
  }
}

TournamentSettings.defaultProps = {
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
  onChange: (name, value) => null,
};

TournamentSettings.propTypes = {
  classes: PropTypes.object.isRequired, // added by withStyles
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
};

export default withStyles(styles, { withTheme: true })(TournamentSettings);
