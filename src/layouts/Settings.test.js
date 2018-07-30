import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import Settings from './Settings';

import api from '../api';

import { mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Settings />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const tree = renderer.create(<Settings />);
  expect(tree.toJSON()).toMatchSnapshot();
});
