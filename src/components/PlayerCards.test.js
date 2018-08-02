import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Card from '@material-ui/core/Card';

import PlayerCards from './PlayerCards';

import { testPlayers } from '../testData';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlayerCards />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const component = renderer.create(<PlayerCards />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<PlayerCards players={testPlayers} />);
  expect(component.toJSON()).toMatchSnapshot();
});

test('selection');

describe('filter props', () => {
  test('search', () => {
    const search = [{
      term: 'test2',
      expect: [ 'mock2' ],
    }, {
      term: 'tes',
      expect: [ 'mock0', 'mock1', 'mock2', 'mock3', 'mock4', 'mock5', 'mock6', 'mock7', 'mock8', 'mock9' ],
    }, {
      term: '5',
      expect: [ 'mock5' ],
    }];
    const wrapper = shallow(<PlayerCards players={testPlayers} />);
    const component = wrapper.dive();
    expect(component.find(Card).length).toBe(testPlayers.length);
    search.forEach((find, index) => {
      component.setProps({
        search: find.term,
      });
      expect(component.find(Card).length).toBe(find.expect.length);
      component.find(Card).forEach((node, i) => {
        expect(node.prop('id')).toBe(find.expect[i]);
      });
    });
  });

  test('no results', () => {
    const wrapper = shallow(<PlayerCards players={testPlayers} />);
    const component = wrapper.dive();
    expect(component.find(Card).length).toBe(testPlayers.length);
    component.setProps({
      search: 'not-found'
    });
    expect(component.find(Card).length).toBe(1);
    expect(component.find(Card).prop('id')).toBe('not-found');
  });
});
