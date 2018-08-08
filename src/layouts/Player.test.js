import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import Player from './Player';

import api from '../api';

import { mockRoute, mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Player />, div);
  ReactDOM.unmountComponentAtNode(div);
});

/* react-swipable-views causes TypeError: Cannot read property 'addEventListener' of null
test('matches the prior snapshot', (done) => {
  const component = renderer.create(<Player match={mockRoute.matchWithID0} />);
  expect(component.toJSON()).toMatchSnapshot();
  setTimeout(() => {
    component.update(<Player match={mockRoute.matchWithID0} />);
    expect(component.toJSON()).toMatchSnapshot();
    done();
  }, 100);
});*/

test('edit');

test('delete');