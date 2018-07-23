import api from './api';

const testSettings = {
  pairingMethod: api.pairingMethods.HISTORIC,
  pairingMethodInitial: api.pairingMethods.HISTORIC,
  podSizeMinimum: 4,
  podSizeMaximum: 7,
};

const testPlayers = [{
  id: 'mock0',
  name: 'test0',
  points: 0,
}, {
  id: 'mock1',
  name: 'test1',
  points: 1,
}, {
  id: 'mock2',
  name: 'test2',
  points: 2,
}, {
  id: 'mock3',
  name: 'test3',
  points: 3,
}, {
  id: 'mock4',
  name: 'test4',
  points: 4,
}, {
  id: 'mock5',
  name: 'test5',
  points: 5,
}, {
  id: 'mock6',
  name: 'test6',
  points: 6,
}, {
  id: 'mock7',
  name: 'test7',
  points: 7,
}, {
  id: 'mock8',
  name: 'test8',
  points: 8,
}, {
  id: 'mock9',
  name: 'test9',
  points: 9,
}];

const testTournaments = [{
  id: 'mock0',
  name: 'test0',
  category: 'cat0',
  description: 'desc0',
  date: 0,
  done: false,
  pairingMethod: api.pairingMethods.RANDOM,
  pairingMethodInitial: api.pairingMethods.RANDOM,
  podSizeMinimum: 3,
  podSizeMaximum: 4,
  rounds: 1,
  players: [{
    id: 'mock0',
    name: 'test0',
    points: 0,
    'round-1': { pod: 1, points: 0 },
  }, {
    id: 'mock1',
    name: 'test1',
    points: 1,
    'round-1': { pod: 1, points: 1 },
  }, {
    id: 'mock2',
    name: 'test2',
    points: 2,
    'round-1': { pod: 1, points: 2 },
  }, {
    id: 'mock3',
    name: 'test3',
    points: 3,
    'round-1': { pod: 1, points: 3 },
  }],
}, {
  id: 'mock1',
  name: 'test1',
  category: 'cat1',
  description: 'desc1',
  date: 1,
  done: true,
  pairingMethod: api.pairingMethods.POINTS,
  pairingMethodInitial: api.pairingMethods.RANDOM,
  podSizeMinimum: 3,
  podSizeMaximum: 5,
  rounds: 2,
  players: [{
    id: 'mock0',
    name: 'test0',
    points: 0,
    'round-1': { pod: 1, points: 0 },
    'round-2': { pod: 1, points: 0 },
  }, {
    id: 'mock1',
    name: 'test1',
    points: 1,
    'round-1': { pod: 1, points: 1 },
    'round-2': { pod: 2, points: 1 },
  }, {
    id: 'mock2',
    name: 'test2',
    points: 2,
    'round-1': { pod: 1, points: 2 },
    'round-2': { pod: 1, points: 2 },
  }, {
    id: 'mock3',
    name: 'test3',
    points: 3,
    'round-1': { pod: 2, points: 3 },
    'round-2': { pod: 2, points: 3 },
  }, {
    id: 'mock4',
    name: 'test4',
    points: 4,
    'round-1': { pod: 2, points: 4 },
    'round-2': { pod: 1, points: 4 },
  }, {
    id: 'mock5',
    name: 'test5',
    points: 5,
    'round-1': { pod: 2, points: 5 },
    'round-2': { pod: 2, points: 5 },
  }, {
    id: 'mock6',
    name: 'test6',
    points: 6,
    'round-2': { pod: 2, points: 6 },
  }],
}];

let mockStore = {};
const mockStorage = {
  setItem: jest.fn().mockImplementation((key, val) => Promise.resolve(mockStore[key] = val)),
  getItem: jest.fn().mockImplementation(key => Promise.resolve(mockStore[key])),
  removeItem: jest.fn().mockImplementation(key => { delete mockStore[key]; Promise.resolve(); }),
  clear: jest.fn().mockImplementation(() => Promise.resolve((mockStore = {}))),
};

let defaultStore = null;
function mockAPI(api, storage) {
  defaultStore = api.store;
  api.store = storage;
  mockStore = {
    settings: testSettings,
    players: testPlayers,
    tournaments: testTournaments,
  };
}
function demockAPI(api) {
  api.store = defaultStore;
  defaultStore = null;
}

export {
  testSettings,
  testPlayers,
  testTournaments,
  mockStore,
  mockStorage,
  mockAPI,
  demockAPI,
};
