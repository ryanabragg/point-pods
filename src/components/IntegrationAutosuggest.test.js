import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import IntegrationAutosuggest from './IntegrationAutosuggest';
import Autosuggest from 'react-autosuggest';
import IconButton from '@material-ui/core/IconButton';

const suggestions = [
  'Victoria',
  'Alexander',
  'Zara',
  'Kara',
  'Katka',
  'Alexandra',
  'Kat',
  'Kaori',
  'Kaya',
  'Jaya',
  'Kyrie',
  'Krystal',
].map(s => ({ id: s, label: s }));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<IntegrationAutosuggest />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const component = renderer.create(<IntegrationAutosuggest />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<IntegrationAutosuggest items={suggestions} />);
  setTimeout(() => {
    try {
      expect(component.toJSON()).toMatchSnapshot();
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 100);
});

describe('integration', () => {
  test('integration props', () => {
    const component = shallow(<IntegrationAutosuggest />);
    let unHOC = component.dive();
    expect(unHOC.find(Autosuggest).prop('renderInputComponent')).toEqual(unHOC.instance().renderInputComponent);
    expect(unHOC.find(Autosuggest).prop('inputProps').placeholder).toEqual('Add a player');
    expect(unHOC.find(Autosuggest).prop('inputProps').value).toEqual(unHOC.state('value'));
    expect(unHOC.find(Autosuggest).prop('inputProps').onChange).toEqual(unHOC.instance().handleChange);
    expect(unHOC.find(Autosuggest).prop('suggestions')).toEqual(unHOC.state('suggestions'));
    expect(unHOC.find(Autosuggest).prop('getSuggestionValue')).toEqual(unHOC.instance().suggestionValue);
    expect(unHOC.find(Autosuggest).prop('onSuggestionsFetchRequested')).toEqual(unHOC.instance().handleSuggestionsFetchRequested);
    expect(unHOC.find(Autosuggest).prop('onSuggestionsClearRequested')).toEqual(unHOC.instance().handleSuggestionsClearRequested);
    expect(unHOC.find(Autosuggest).prop('onSuggestionSelected')).toEqual(unHOC.instance().handleSuggestionSelected);
    expect(unHOC.find(Autosuggest).prop('renderSuggestionsContainer')).toEqual(unHOC.instance().renderSuggestionsContainer);
    expect(unHOC.find(Autosuggest).prop('renderSuggestion')).toEqual(unHOC.instance().renderSuggestion);
  });

  test('add button', () => {
    const component = shallow(<IntegrationAutosuggest items={suggestions} />);
    let unHOC = component.dive();
    expect(unHOC.find(IconButton).length).toBe(0);
    component.setProps({ buttonIcon: 'test' });
    unHOC = component.dive();
    expect(unHOC.find(IconButton).prop('onClick')).toEqual(unHOC.instance().handleSuggestionButton);
  });
});

describe('actions', () => {
  test('select a suggestion', () => {
    const selection = { id: 'testID', label: 'test' };
    const onSelect = jest.fn(r => r);
    const component = shallow(<IntegrationAutosuggest onSelect={onSelect} />);
    let unHOC = component.dive();
    unHOC.instance().handleSuggestionSelected({event: 'test'}, { suggestion: selection });
    expect(onSelect.mock.calls[0][0]).toEqual(selection);
  });

  test('add a new value', () => {
    const selection = { id: null, label: 'test' };
    const onSelect = jest.fn(r => r);
    const component = shallow(<IntegrationAutosuggest onSelect={onSelect} />);
    let unHOC = component.dive();
    unHOC.setState({
      value: selection.label,
    });
    unHOC.instance().handleSuggestionButton();
    expect(unHOC.state('value')).toBe(selection.label);
    expect(onSelect.mock.calls[0][0]).toEqual(selection);
    unHOC.setProps({
      clearOnSelect: true,
    });
    unHOC.instance().handleSuggestionButton();
    expect(unHOC.state('value')).toBe('');
    expect(onSelect.mock.calls[0][0]).toEqual(selection);
  });
});
