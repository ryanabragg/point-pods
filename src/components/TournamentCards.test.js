import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Card from '@material-ui/core/Card';

import TournamentCards from './TournamentCards';

import { testTournaments } from '../testData';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TournamentCards />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const component = renderer.create(<TournamentCards />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<TournamentCards tournaments={testTournaments} />);
  expect(component.toJSON()).toMatchSnapshot();
});

test('selection');

describe('filter props', () => {
  test('status', () => {
    const wrapper = shallow(<TournamentCards tournaments={testTournaments} />);
    const component = wrapper.dive();
    expect(component.find(Card).length).toBe(testTournaments.length);
    component.setProps({
      category: '',
      status: 'Pending',
    });
    expect(component.find(Card).length).toBe(1);
    expect(component.find(Card).prop('id')).toBe('mock0');
    component.setProps({
      status: 'In Progress',
    });
    expect(component.find(Card).length).toBe(1);
    expect(component.find(Card).prop('id')).toBe('mock2');
    component.setProps({
      status: 'Incomplete',
    });
    expect(component.find(Card).length).toBe(2);
    expect(component.find(Card).at(0).prop('id')).toBe('mock0');
    expect(component.find(Card).at(1).prop('id')).toBe('mock2');
    component.setProps({
      status: 'Complete',
    });
    expect(component.find(Card).length).toBe(1);
    expect(component.find(Card).prop('id')).toBe('mock1');
  });

  test('category', () => {
    const wrapper = shallow(<TournamentCards tournaments={testTournaments} />);
    const component = wrapper.dive();
    expect(component.find(Card).length).toBe(testTournaments.length);
    component.setProps({
      category: 'cat0',
    });
    expect(component.find(Card).length).toBe(2);
    expect(component.find(Card).at(0).prop('id')).toBe('mock0');
    expect(component.find(Card).at(1).prop('id')).toBe('mock2');
    component.setProps({
      category: 'cat1',
    });
    expect(component.find(Card).length).toBe(1);
    expect(component.find(Card).prop('id')).toBe('mock1');
  });

  test('search', () => {
    const search = [{
      term: 'test2',
      expect: [ 'mock2' ],
    }, {
      term: 'dolor sit amet',
      expect: [ 'mock0', 'mock1', 'mock2' ],
    }, {
      term: 'mauris vitae',
      expect: [ 'mock0', 'mock2' ],
    }, {
      term: 'suscipit',
      expect: [ 'mock1' ],
    }];
    const wrapper = shallow(<TournamentCards tournaments={testTournaments} />);
    const component = wrapper.dive();
    expect(component.find(Card).length).toBe(testTournaments.length);
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
    const wrapper = shallow(<TournamentCards tournaments={testTournaments} />);
    const component = wrapper.dive();
    expect(component.find(Card).length).toBe(testTournaments.length);
    component.setProps({
      category: 'not-found'
    });
    expect(component.find(Card).length).toBe(1);
    expect(component.find(Card).prop('id')).toBe('not-found');
  });
});
