import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import TournamentList from './TournamentList';

import api from '../api';

import { testTournaments, mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TournamentList />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const component = renderer.create(<TournamentList />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<TournamentList />);
  setTimeout(() => {
    try {
      expect(component.toJSON()).toMatchSnapshot();
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 100);
});

test('is a HOC-ed component', () => {
  const wrapper = shallow(<TournamentList />);
  expect(wrapper.type().prototype.constructor.name).toBe('APIComponent');
  expect(wrapper.dive().type().prototype.constructor.name).toBe('TournamentList');
});

describe('defaults', () => {
  test('values', () => {
    const wrapper = shallow(<TournamentList />);
    const component = wrapper.dive().dive();
    expect(component.state('dialog')).toBe(null);
    expect(component.state('searching')).toBe(false);
    expect(component.state('sort')).toEqual({field: 'name', ascending: true});
    expect(component.state('selected')).toEqual([]);
  });

  test('loads the state', (done) => {
    const wrapper = shallow(<TournamentList />);
    const component = wrapper.dive().dive();
    expect(component.state('tournaments')).toEqual([]);
    expect(component.state('categories')).toEqual([]);
    setTimeout(() => {
      try {
        expect(component.state('tournaments')).toEqual(testTournaments);
        expect(component.state('categories')).toEqual(testTournaments.map(t => t.category)
          .filter((cat, i, self) => cat && self.indexOf(cat) === i).sort());
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });
});

describe('actions', () => {
  test('select');

  test('searching');

  test('filter by category');

  test('filter by status');

  test('sorting');

  test('add a tournament', () => {
    const wrapper = shallow(<TournamentList />);
    const component = wrapper.dive().dive();
    expect(component.findWhere(n => n.prop('variant') === 'fab').prop('href')).toBe('/new');
  });
});
