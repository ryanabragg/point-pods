import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Button from '@material-ui/core/Button';

import AppMenu from '../components/AppMenu';
import Tournament from './Tournament';
import SwipeTabControl from '../components/SwipeTabControl';

import api from '../api';

import { mockRoute, mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Tournament />, div);
  ReactDOM.unmountComponentAtNode(div);
});

/* react-swipable-views causes TypeError: Cannot read property 'addEventListener' of null
test('matches the prior snapshot', (done) => {
  const component = renderer.create(<Tournament match={mockRoute.matchWithID1} />);
  expect(component.toJSON()).toMatchSnapshot();
  setTimeout(() => {
    component.update(<Tournament match={mockRoute.matchWithID0} />);
    expect(component.toJSON()).toMatchSnapshot();
    done();
  }, 100);
});*/

describe('players', () => {
  test('init: add player');
  test('init: remove player');
  test('add player');
  test('drop player');
});

describe('pods', () => {
  test('start tournament');
  test('re-pod');
  test('move player to pod');
});

describe('points', () => {
  test('update total points for players on starting a round');
  test('player points updated');
});

test('edit settings');
test('delete');

test('printing', () => {
  const component = shallow(<Tournament />).dive().dive();
  expect(component.find(AppMenu).prop('className')).toBe('APIComponent-hideOnPrint-234');
  expect(component.find(Button).find({variant: 'extendedFab'}).prop('className')).toBe('APIComponent-actionButton-227 APIComponent-hideOnPrint-234');
  expect(component.find(SwipeTabControl).prop('hideTabsOnPrint')).toBe(true);
});
