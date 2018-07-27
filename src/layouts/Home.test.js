import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import Home from './Home';

import api from '../api';

import { mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Home />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const tree = renderer.create(<Home />);
  expect(tree.toJSON()).toMatchSnapshot();
});
