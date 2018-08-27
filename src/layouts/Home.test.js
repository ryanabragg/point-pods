import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Button from '@material-ui/core/Button';

import Home from './Home';
import AppMenu from '../components/AppMenu';

import api from '../api';

import { mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Home />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const component = renderer.create(<Home />);
  expect(component.toJSON()).toMatchSnapshot();
  setTimeout(() => {
    component.update(<Home />);
    expect(component.toJSON()).toMatchSnapshot();
    done();
  }, 100);
});

test('FAB opens modal', () => {
  const spy = jest.fn(v => v);
  const component = shallow(<Home />).dive().dive();
  expect(component.find(Button).length).toBe(1);
  expect(component.find(Button).prop('variant')).toBe('fab');
  expect(component.state('newTournament')).toBe(false);
  expect(component.find(AppMenu).prop('showNew')).toBe(false);
  component.find(Button).simulate('click');
  expect(component.state('newTournament')).toBe(true);
  expect(component.find(AppMenu).prop('showNew')).toBe(true);
});
