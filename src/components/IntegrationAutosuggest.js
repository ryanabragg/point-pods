import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

const styles = theme => ({
  root: {
    display: 'flex',
    flexGrow: 0,
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
});

class IntegrationAutosuggest extends React.Component {
  state = {
    value: '',
    suggestions: [],
  };

  handleChange = (event, { newValue }) => {
    this.setState({ value: newValue });
  };

  getSuggestionsList = (value) => {
    const regex = RegExp('\\b' + value.toLowerCase());
    let count = 0;
    if(value.length === 0)
      return [];
    return this.props.items.filter(item => {
      const match = count < this.props.listLength && regex.test(item.label.toLowerCase());
      if(match)
        count++;
      return match;
    });
  };

  handleSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    this.props.onSelect(suggestion);
    if(this.props.clearOnSelect)
      this.setState({ value: '', suggestions: [] });
  };

  handleSuggestionButton = (event) => {
    this.props.onSelect({id: null, label: this.state.value});
    if(this.props.clearOnSelect)
      this.setState({ value: '', suggestions: [] });
  };

  suggestionValue = (suggestion) => suggestion.label;

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestionsList(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: this.props.items,
    });
  };

  renderInputComponent = (props) => {
    const { classes, ref, ...other } = props;
    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: ref,
          classes: {
            input: classes.input,
          },
          ...other,
        }}
      />
    );
  };

  renderSuggestionsContainer = (props) => {
    const { containerProps, children } = props;
    return (
      <Paper {...containerProps} square>
        {children}
      </Paper>
    );
  };

  renderSuggestion = (suggestion, { query, isHighlighted }) => {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches);
    return (
      <MenuItem selected={isHighlighted} component="div">
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
      </MenuItem>
    );
  };

  render() {
    const { classes, buttonIcon } = this.props;

    return (
      <div className={classes.root}>
        <Autosuggest
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderInputComponent={this.renderInputComponent}
          inputProps={{
            classes,
            placeholder: 'Add a player',
            value: this.state.value,
            onChange: this.handleChange,
          }}
          suggestions={this.state.suggestions}
          getSuggestionValue={this.suggestionValue}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          onSuggestionSelected={this.handleSuggestionSelected}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          renderSuggestion={this.renderSuggestion}
        />
        {buttonIcon &&
          <IconButton color='inherit' onClick={this.handleSuggestionButton}>
            {buttonIcon}
          </IconButton>
        }
      </div>
    );
  }
}

IntegrationAutosuggest.defaultProps = {
  items: [],
  listLength: 5,
  onSelect: ({id, label}) => null,
  clearOnSelect: false,
  buttonIcon: null,
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
  items: PropTypes.array,
  listLength: PropTypes.number,
  onSelect: PropTypes.func,
  clearOnSelect: PropTypes.bool,
  buttonIcon: PropTypes.element,
}

export default withStyles(styles, { withTheme: true })(IntegrationAutosuggest);
