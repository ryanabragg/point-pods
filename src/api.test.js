import React from 'react';
import { shallow, mount } from 'enzyme';

import api, { withAPI } from './api';

import {
  testSettings,
  testPlayers,
  testTournaments,
  mockStore,
  mockStorage,
  mockAPI,
  demockAPI
} from './testData';

test('exports the expected values', () => {
  expect(api).toBeInstanceOf(Object);
  expect(withAPI).toBeInstanceOf(Function);
});

describe('the api object', () => {

  test('has localforage as a store object', () => {
    expect(api.hasOwnProperty('store')).toBe(true);
    expect(api.store._defaultConfig.name).toBe('localforage');
  });

  test('has a pairingMethods object', () => {
    expect(api.pairingMethods).toBeInstanceOf(Object);
    expect(api.pairingMethods.hasOwnProperty('RANDOM')).toBe(true);
    expect(api.pairingMethods.hasOwnProperty('POINTS')).toBe(true);
    expect(api.pairingMethods.hasOwnProperty('HISTORIC')).toBe(true);
  });

  describe('has a Settings object', () => {  
    expect(api.Settings).toBeInstanceOf(Object);

    beforeEach(() => {
      mockAPI(api, mockStorage);
      mockStorage.getItem.mockClear();
      mockStorage.setItem.mockClear();
      mockStorage.removeItem.mockClear();
    });
    afterEach(() => demockAPI(api));

    test('with a default function', async () => {
      expect(api.Settings.default).toBeInstanceOf(Function);
      const defaults = await api.Settings.default();
      expect(defaults.hasOwnProperty('pairingMethod')).toBe(true);
      expect(defaults.hasOwnProperty('pairingMethodInitial')).toBe(true);
      expect(defaults.hasOwnProperty('podSizeMinimum')).toBe(true);
      expect(defaults.hasOwnProperty('podSizeMaximum')).toBe(true);
    });

    test('with a get function', async () => {
      expect(api.Settings.get).toBeInstanceOf(Function);
      const getDefault = await api.Settings.get();
      expect(getDefault).toEqual(testSettings);
      expect(mockStorage.getItem.mock.calls[0][0]).toBe('settings');
    });

    test('with a set function', async () => {
      expect(api.Settings.set).toBeInstanceOf(Function);
      const setMocked = await api.Settings.set({
        pairingMethod: api.pairingMethods.HISTORIC,
      });
      expect(setMocked).toEqual(mockStore.settings);
      expect(mockStorage.setItem.mock.calls.length).toBe(1);
      expect(mockStorage.getItem.mock.calls[0][0]).toBe('settings');
      expect(mockStorage.setItem.mock.calls[0][1]).toEqual(Object.assign(
        {},
        testSettings,
        { pairingMethod: api.pairingMethods.HISTORIC, },
      ));
    });
  });

  describe('has a Players object', () => {  
    expect(api.Players).toBeInstanceOf(Object);

    beforeEach(() => {
      mockAPI(api, mockStorage);
      mockStorage.getItem.mockClear();
      mockStorage.setItem.mockClear();
      mockStorage.removeItem.mockClear();
    });
    afterEach(() => demockAPI(api));
    
    test('with an all function', async () => {
      expect(api.Players.all).toBeInstanceOf(Function);
      const allMocked = await api.Players.all();
      expect(allMocked).toEqual(testPlayers);
      expect(mockStorage.getItem.mock.calls.length).toBe(1);
      expect(mockStorage.getItem.mock.calls[0][0]).toBe('players');
    });

    test('with a get function', async () => {
      expect(api.Players.get).toBeInstanceOf(Function);
      const getMocked = await api.Players.get('mock4');
      try {
        const notFound = await api.Players.get('not-found');
        expect('this resolves').not.toBeTruthy();
      } catch (e) {
        expect(e.message).toBe('ID not found');
      }
      expect(getMocked).toEqual(testPlayers[4]);
      expect(mockStorage.getItem.mock.calls.length).toBe(2);
      expect(mockStorage.getItem.mock.calls[1][0]).toBe('players');
    });

    test('with a set function', async () => {
      expect(api.Players.set).toBeInstanceOf(Function);
      const setMocked = await api.Players.set({
        id: 'mock1',
        name: 'changed',
      });
      expect(setMocked).toBe(mockStore.players[1]);
      try {
        const notFound = await api.Players.set({
          id: 'not-found',
          name: 'changed',
        });
        expect('this resolves').not.toBeTruthy();
      } catch (e) {
        expect(e.message).toBe('ID not found');
      }
      expect(mockStorage.getItem.mock.calls.length).toBe(2);
      expect(mockStorage.getItem.mock.calls[0][0]).toBe('players');
      expect(mockStorage.getItem.mock.calls[1][0]).toBe('players');
      expect(mockStorage.setItem.mock.calls.length).toBe(1);
      expect(mockStorage.setItem.mock.calls[0][0]).toBe('players');
      expect(mockStorage.setItem.mock.calls[0][1]).toEqual(testPlayers.map(i => {
        if(i.id === 'mock1')
          return Object.assign({}, i, {name: 'changed'});
        return i;
      }));
      expect(mockStorage.removeItem.mock.calls.length).toBe(0);
    });

    test('with a remove function', async () => {
      expect(api.Players.remove).toBeInstanceOf(Function);
      const removeMocked = await api.Players.remove('mock6');
      expect(removeMocked).toBe(mockStore.players);
      try {
        const notFound = await api.Players.remove('not-found');
        expect('this resolves').toBeFalsy();
      } catch (e) {
        expect(e.message).toBe('ID not found');
      }
      expect(mockStorage.getItem.mock.calls.length).toBe(2);
      expect(mockStorage.getItem.mock.calls[0][0]).toBe('players');
      expect(mockStorage.getItem.mock.calls[1][0]).toBe('players');
      expect(mockStorage.setItem.mock.calls.length).toBe(1);
      expect(mockStorage.setItem.mock.calls[0][0]).toBe('players');
      expect(mockStorage.setItem.mock.calls[0][1]).toEqual(testPlayers.filter(i => i.id !== 'mock6'));
      expect(mockStorage.removeItem.mock.calls.length).toBe(0);
    });
  });

  describe('has a Tournaments object', () => {  
    expect(api.Tournaments).toBeInstanceOf(Object);

    beforeEach(() => {
      mockAPI(api, mockStorage);
      mockStorage.getItem.mockClear();
      mockStorage.setItem.mockClear();
      mockStorage.removeItem.mockClear();
    });
    afterEach(() => demockAPI(api));
    
    test('with an all function', async () => {
      expect(api.Tournaments.all).toBeInstanceOf(Function);
      const allMocked = await api.Tournaments.all();
      expect(allMocked).toEqual(testTournaments);
      expect(mockStorage.getItem.mock.calls.length).toBe(1);
      expect(mockStorage.getItem.mock.calls[0][0]).toBe('tournaments');
    });

    test('with a get function', async () => {
      expect(api.Tournaments.get).toBeInstanceOf(Function);
      const getMocked = await api.Tournaments.get('mock1');
      try {
        const notFound = await api.Tournaments.get('not-found');
        expect('this resolves').not.toBeTruthy();
      } catch (e) {
        expect(e.message).toBe('ID not found');
      }
      expect(getMocked).toEqual(testTournaments[1]);
      expect(mockStorage.getItem.mock.calls.length).toBe(2);
      expect(mockStorage.getItem.mock.calls[1][0]).toBe('tournaments');
    });

    test('with a set function', async () => {
      expect(api.Tournaments.set).toBeInstanceOf(Function);
      const setMocked = await api.Tournaments.set({
        id: 'mock1',
        name: 'changed',
      });
      expect(setMocked).toBe(mockStore.tournaments[1]);
      try {
        const notFound = await api.Tournaments.set({
          id: 'not-found',
          name: 'changed',
        });
        expect('this resolves').not.toBeTruthy();
      } catch (e) {
        expect(e.message).toBe('ID not found');
      }
      expect(mockStorage.getItem.mock.calls.length).toBe(2);
      expect(mockStorage.getItem.mock.calls[0][0]).toBe('tournaments');
      expect(mockStorage.getItem.mock.calls[1][0]).toBe('tournaments');
      expect(mockStorage.setItem.mock.calls.length).toBe(1);
      expect(mockStorage.setItem.mock.calls[0][0]).toBe('tournaments');
      expect(mockStorage.setItem.mock.calls[0][1]).toEqual(testTournaments.map(i => {
        if(i.id === 'mock1')
          return Object.assign({}, i, {name: 'changed'});
        return i;
      }));
      expect(mockStorage.removeItem.mock.calls.length).toBe(0);
    });

    test('with a remove function', async () => {
      expect(api.Tournaments.remove).toBeInstanceOf(Function);
      const removeMocked = await api.Tournaments.remove('mock1');
      expect(removeMocked).toBe(mockStore.tournaments);
      try {
        const notFound = await api.Tournaments.remove('not-found');
        expect('this resolves').toBeFalsy();
      } catch (e) {
        expect(e.message).toBe('ID not found');
      }
      expect(mockStorage.getItem.mock.calls.length).toBe(2);
      expect(mockStorage.getItem.mock.calls[0][0]).toBe('tournaments');
      expect(mockStorage.getItem.mock.calls[1][0]).toBe('tournaments');
      expect(mockStorage.setItem.mock.calls.length).toBe(1);
      expect(mockStorage.setItem.mock.calls[0][0]).toBe('tournaments');
      expect(mockStorage.setItem.mock.calls[0][1]).toEqual(testTournaments.filter(i => i.id !== 'mock1'));
      expect(mockStorage.removeItem.mock.calls.length).toBe(0);
    });
  });

});

describe('the withAPI HOC', () => {
  test('adds the api as a prop to the parameter component', () => {
    const Test = withAPI((props) => (
      <div id='test'>{props.api.store._defaultConfig.name}</div>
    ));
    const wrapper = mount(<Test />);
    expect(wrapper.text()).toBe('localforage');
  });
});
