import api, { withAPI } from './api';

import { testSettings, testPlayers, testTournaments } from './testData';

const mockedAPI = Object.assign({}, api);

mockedAPI.store.getItem = jest.fn(key => {
  return new Promise((resolve, reject) => {
    switch(key) {
    case 'settings': resolve(testSettings);
    case 'players': resolve(testPlayers);
    case 'tournaments': resolve(testTournaments);
    };
    reject('invalid key');
  });
});
mockedAPI.store.setItem = jest.fn(() => Promise.resolve('updated'));
mockedAPI.store.removeItem = jest.fn(() => Promise.resolve('removed'));

beforeEach(() => {
  mockedAPI.store.getItem.mockClear();
  mockedAPI.store.setItem.mockClear();
  mockedAPI.store.removeItem.mockClear();
});

it('exports the expected values', () => {
  expect(api).toBeInstanceOf(Object);
  expect(withAPI).toBeInstanceOf(Function);
});

it('has localforage as store', () => {
  expect(api.hasOwnProperty('store')).toBe(true);
  expect(api.store._defaultConfig.name).toBe('localforage');
});

it('has a pairingMethods object', () => {
  expect(api.pairingMethods).toBeInstanceOf(Object);
  expect(api.pairingMethods.hasOwnProperty('RANDOM')).toBe(true);
  expect(api.pairingMethods.hasOwnProperty('POINTS')).toBe(true);
  expect(api.pairingMethods.hasOwnProperty('HISTORIC')).toBe(true);
});

describe('has a Settings object', () => {  
  expect(api.Settings).toBeInstanceOf(Object);

  it('with a default function', async () => {
    expect(api.Settings.default).toBeInstanceOf(Function);
    const defaults = await api.Settings.default();
    expect(defaults.hasOwnProperty('pairingMethod')).toBe(true);
    expect(defaults.hasOwnProperty('pairingMethodInitial')).toBe(true);
    expect(defaults.hasOwnProperty('podSizeMinimum')).toBe(true);
    expect(defaults.hasOwnProperty('podSizeMaximum')).toBe(true);
  });

  it('with a get function', async () => {
    expect(api.Settings.get).toBeInstanceOf(Function);
    const getDefault = await api.Settings.get();
    expect(getDefault).toEqual(testSettings);
    expect(mockedAPI.store.getItem.mock.calls[0][0]).toBe('settings');
  });

  it('with a set function', async () => {
    expect(api.Settings.set).toBeInstanceOf(Function);
    const setMocked = await api.Settings.set({
      pairingMethod: api.pairingMethods.HISTORIC,
    });
    expect(setMocked).toBe('updated');
    expect(mockedAPI.store.setItem.mock.calls.length).toBe(1);
    expect(mockedAPI.store.getItem.mock.calls[0][0]).toBe('settings');
    expect(mockedAPI.store.setItem.mock.calls[0][1]).toEqual(Object.assign(
      {},
      testSettings,
      { pairingMethod: api.pairingMethods.HISTORIC, },
    ));
  });
});

describe('has a Players object', () => {  
  expect(api.Players).toBeInstanceOf(Object);
  
  it('with an all function', async () => {
    expect(api.Players.all).toBeInstanceOf(Function);
    const allMocked = await mockedAPI.Players.all();
    expect(allMocked).toEqual(testPlayers);
    expect(mockedAPI.store.getItem.mock.calls.length).toBe(1);
    expect(mockedAPI.store.getItem.mock.calls[0][0]).toBe('players');
  });

  it('with a get function', async () => {
    expect(api.Players.get).toBeInstanceOf(Function);
    const getMocked = await mockedAPI.Players.get('mock4');
    try {
      const notFound = await mockedAPI.Players.get('not-found');
      expect('this resolves').not.toBeTruthy();
    } catch (e) {
      expect(e.message).toBe('ID not found');
    }
    expect(getMocked).toEqual(testPlayers[4]);
    expect(mockedAPI.store.getItem.mock.calls.length).toBe(2);
    expect(mockedAPI.store.getItem.mock.calls[1][0]).toBe('players');
  });

  it('with a set function', async () => {
    expect(api.Players.set).toBeInstanceOf(Function);
    const setMocked = await api.Players.set({
      id: 'mock1',
      name: 'changed',
    });
    expect(setMocked).toBe('updated');
    try {
      const notFound = await mockedAPI.Players.set({
        id: 'not-found',
        name: 'changed',
      });
      expect('this resolves').not.toBeTruthy();
    } catch (e) {
      expect(e.message).toBe('ID not found');
    }
    expect(mockedAPI.store.getItem.mock.calls.length).toBe(2);
    expect(mockedAPI.store.getItem.mock.calls[0][0]).toBe('players');
    expect(mockedAPI.store.getItem.mock.calls[1][0]).toBe('players');
    expect(mockedAPI.store.setItem.mock.calls.length).toBe(1);
    expect(mockedAPI.store.setItem.mock.calls[0][0]).toBe('players');
    expect(mockedAPI.store.setItem.mock.calls[0][1]).toEqual(testPlayers.map(i => {
      if(i.id === 'mock1')
        return Object.assign({}, i, {name: 'changed'});
      return i;
    }));
    expect(mockedAPI.store.removeItem.mock.calls.length).toBe(0);
  });

  it('with a remove function', async () => {
    expect(api.Players.remove).toBeInstanceOf(Function);
    const removeMocked = await api.Players.remove('mock6');
    expect(removeMocked).toBe('updated');
    try {
      const notFound = await mockedAPI.Players.remove('not-found');
      expect('this resolves').toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('ID not found');
    }
    expect(mockedAPI.store.getItem.mock.calls.length).toBe(2);
    expect(mockedAPI.store.getItem.mock.calls[0][0]).toBe('players');
    expect(mockedAPI.store.getItem.mock.calls[1][0]).toBe('players');
    expect(mockedAPI.store.setItem.mock.calls.length).toBe(1);
    expect(mockedAPI.store.setItem.mock.calls[0][0]).toBe('players');
    expect(mockedAPI.store.setItem.mock.calls[0][1]).toEqual(testPlayers.filter(i => i.id !== 'mock6'));
    expect(mockedAPI.store.removeItem.mock.calls.length).toBe(0);
  });
});

describe('has a Tournaments object', () => {  
  expect(api.Tournaments).toBeInstanceOf(Object);
  
  it('with an all function', async () => {
    expect(api.Tournaments.all).toBeInstanceOf(Function);
    const allMocked = await mockedAPI.Tournaments.all();
    expect(allMocked).toEqual(testTournaments);
    expect(mockedAPI.store.getItem.mock.calls.length).toBe(1);
    expect(mockedAPI.store.getItem.mock.calls[0][0]).toBe('tournaments');
  });

  it('with a get function', async () => {
    expect(api.Tournaments.get).toBeInstanceOf(Function);
    const getMocked = await mockedAPI.Tournaments.get('mock1');
    try {
      const notFound = await mockedAPI.Tournaments.get('not-found');
      expect('this resolves').not.toBeTruthy();
    } catch (e) {
      expect(e.message).toBe('ID not found');
    }
    expect(getMocked).toEqual(testTournaments[1]);
    expect(mockedAPI.store.getItem.mock.calls.length).toBe(2);
    expect(mockedAPI.store.getItem.mock.calls[1][0]).toBe('tournaments');
  });

  it('with a set function', async () => {
    expect(api.Tournaments.set).toBeInstanceOf(Function);
    const setMocked = await api.Tournaments.set({
      id: 'mock1',
      name: 'changed',
    });
    expect(setMocked).toBe('updated');
    try {
      const notFound = await mockedAPI.Tournaments.set({
        id: 'not-found',
        name: 'changed',
      });
      expect('this resolves').not.toBeTruthy();
    } catch (e) {
      expect(e.message).toBe('ID not found');
    }
    expect(mockedAPI.store.getItem.mock.calls.length).toBe(2);
    expect(mockedAPI.store.getItem.mock.calls[0][0]).toBe('tournaments');
    expect(mockedAPI.store.getItem.mock.calls[1][0]).toBe('tournaments');
    expect(mockedAPI.store.setItem.mock.calls.length).toBe(1);
    expect(mockedAPI.store.setItem.mock.calls[0][0]).toBe('tournaments');
    expect(mockedAPI.store.setItem.mock.calls[0][1]).toEqual(testTournaments.map(i => {
      if(i.id === 'mock1')
        return Object.assign({}, i, {name: 'changed'});
      return i;
    }));
    expect(mockedAPI.store.removeItem.mock.calls.length).toBe(0);
  });

  it('with a remove function', async () => {
    expect(api.Tournaments.remove).toBeInstanceOf(Function);
    const removeMocked = await api.Tournaments.remove('mock1');
    expect(removeMocked).toBe('updated');
    try {
      const notFound = await mockedAPI.Tournaments.remove('not-found');
      expect('this resolves').toBeFalsy();
    } catch (e) {
      expect(e.message).toBe('ID not found');
    }
    expect(mockedAPI.store.getItem.mock.calls.length).toBe(2);
    expect(mockedAPI.store.getItem.mock.calls[0][0]).toBe('tournaments');
    expect(mockedAPI.store.getItem.mock.calls[1][0]).toBe('tournaments');
    expect(mockedAPI.store.setItem.mock.calls.length).toBe(1);
    expect(mockedAPI.store.setItem.mock.calls[0][0]).toBe('tournaments');
    expect(mockedAPI.store.setItem.mock.calls[0][1]).toEqual(testTournaments.filter(i => i.id !== 'mock1'));
    expect(mockedAPI.store.removeItem.mock.calls.length).toBe(0);
  });
});
