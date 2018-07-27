import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import api from './api';

import { mockStorage, mockAPI, demockAPI } from './testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
