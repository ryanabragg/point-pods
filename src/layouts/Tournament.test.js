import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import Tournament from './Tournament';

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