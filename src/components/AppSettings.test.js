import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import CardHeader from '@material-ui/core/CardHeader';

import AppSettings from './AppSettings';

import api from '../api';

import { testSettings, testTournaments, mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppSettings />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const component = renderer.create(<AppSettings />);
  expect(component.toJSON()).toMatchSnapshot();
    component.update(<AppSettings />);
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
  const component = shallow(<AppSettings />);
  expect(component.type().prototype.constructor.name).toBe('APIComponent');
  expect(component.dive().type().prototype.constructor.name).toBe('AppSettings');
});

describe('default values', () => {
  test('loads the pod sorting options', (done) => {
    let methodsArray = Object.keys(api.pairingMethods)
      .map(key => ({
        label: key.slice(0,1).toUpperCase() + key.slice(1).toLowerCase(),
        value: api.pairingMethods[key]
      }));
    const component = shallow(<AppSettings />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      try {
        expect(unHOC.state('pairingMethods')).toEqual(methodsArray);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });

  test('loads the api tournament settings', (done) => {
    const component = shallow(<AppSettings />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      try {
        expect(unHOC.state('pairingMethod')).toBe(testSettings.pairingMethod);
        expect(unHOC.state('pairingMethodInitial')).toBe(testSettings.pairingMethodInitial);
        expect(unHOC.state('podSizeMinimum')).toBe(testSettings.podSizeMinimum);
        expect(unHOC.state('podSizeMaximum')).toBe(testSettings.podSizeMaximum);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });

  test('saves settings as they are changed', (done) => {
    const spy = jest.fn(r => r);
    const component = shallow(<AppSettings />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      try {
        expect(testSettings.pairingMethod).toBe(api.pairingMethods.HISTORIC);
        unHOC.find('#settings-pairingMethod').simulate('change', {target: {value: api.pairingMethods.POINTS}});
        expect(testSettings.pairingMethodInitial).toBe(api.pairingMethods.HISTORIC);
        unHOC.find('#settings-pairingMethodInitial').simulate('change', {target: {value: api.pairingMethods.RANDOM}});
        expect(testSettings.podSizeMinimum).toBe(4);
        unHOC.find('#settings-podSizeMinimum').simulate('change', {target: {value: 3}});
        expect(testSettings.podSizeMaximum).toBe(7);
        unHOC.find('#settings-podSizeMaximum').simulate('change', {target: {value: 4}});
        setTimeout(() => {
          try {
            expect(testSettings.pairingMethod).toBe(api.pairingMethods.POINTS);
            expect(testSettings.pairingMethodInitial).toBe(api.pairingMethods.RANDOM);
            expect(testSettings.podSizeMinimum).toBe(3);
            expect(testSettings.podSizeMaximum).toBe(4);
            done();
          } catch (error) {
            done.fail(error);
          }
        }, 100);
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });
});
