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
});

test('saves settings as they are changed', (done) => {
  let next = {
    pairingMethod: testSettings.pairingMethod,
    pairingMethodInitial: testSettings.pairingMethodInitial,
    podSizeMaximum: testSettings.podSizeMaximum,
    podSizeMinimum: testSettings.podSizeMinimum,
  };
  const spy = jest.fn(r => r);
  const component = shallow(<AppSettings />);
  const unHOC = component.dive().dive();
  setTimeout(() => {
    try {
      next.pairingMethod = api.pairingMethods.POINTS;
      expect(testSettings.pairingMethod).toBe(api.pairingMethods.HISTORIC);
      unHOC.find('#settings-pairingMethod').simulate('change', {target: {value: next.pairingMethod}});
      setTimeout(() => {
        try {
          //expect(mockStorage.setItem.mock.calls.length).toBe(1);
          expect(mockStorage.setItem.mock.calls[0][0]).toBe('settings');
          expect(mockStorage.setItem.mock.calls[0][1]).toEqual(next);
        } catch (error) {
          done.fail(error);
        }
        next.pairingMethodInitial = api.pairingMethods.RANDOM;
        expect(testSettings.pairingMethodInitial).toBe(api.pairingMethods.HISTORIC);
        unHOC.find('#settings-pairingMethodInitial').simulate('change', {target: {value: next.pairingMethodInitial}});
      }, 100);
      setTimeout(() => {
        try {
          expect(mockStorage.setItem.mock.calls.length).toBe(2);
          expect(mockStorage.setItem.mock.calls[1][0]).toBe('settings');
          expect(mockStorage.setItem.mock.calls[1][1]).toEqual(next);
        } catch (error) {
          done.fail(error);
        }
        next.podSizeMinimum = 3;
        expect(testSettings.podSizeMinimum).toBe(4);
        unHOC.find('#settings-podSizeMinimum').simulate('change', {target: {value: next.podSizeMinimum}});
      }, 200);
      setTimeout(() => {
        try {
          expect(mockStorage.setItem.mock.calls.length).toBe(3);
          expect(mockStorage.setItem.mock.calls[2][0]).toBe('settings');
          expect(mockStorage.setItem.mock.calls[2][1]).toEqual(next);
        } catch (error) {
          done.fail(error);
        }
        next.podSizeMaximum = 4;
        expect(testSettings.podSizeMaximum).toBe(7);
        unHOC.find('#settings-podSizeMaximum').simulate('change', {target: {value: next.podSizeMaximum}});
      }, 300);
      setTimeout(() => {
        try {
          expect(mockStorage.setItem.mock.calls.length).toBe(4);
          expect(mockStorage.setItem.mock.calls[3][0]).toBe('settings');
          expect(mockStorage.setItem.mock.calls[3][1]).toEqual(next);
        } catch (error) {
          done.fail(error);
        }
      }, 400);
    } catch (error) {
      done.fail(error);
    }
  }, 100);
  setTimeout(() => done(), 1000);
});
