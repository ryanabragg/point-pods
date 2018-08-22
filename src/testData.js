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
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae tellus nunc. Etiam urna tortor, laoreet vitae commodo porttitor, mattis id purus.',
  date: new Date('2018-01-01'),
  done: false,
  staging: true,
  pairingMethod: api.pairingMethods.RANDOM,
  pairingMethodInitial: api.pairingMethods.RANDOM,
  podSizeMinimum: 3,
  podSizeMaximum: 4,
  rounds: 1,
  players: [{
    id: 'mock0',
    name: 'test0',
    points: 3,
    participated: true,
    dropped: true,
    1: { pod: 1, points: 3 },
  }, {
    id: 'mock1',
    name: 'test1',
    points: 1,
    participated: true,
    dropped: false,
    1: { pod: 1, points: 1 },
  }, {
    id: 'mock2',
    name: 'test2',
    points: 2,
    participated: true,
    dropped: false,
    1: { pod: 1, points: 2 },
  }, {
    id: 'mock3',
    name: 'test3',
    points: 0,
    participated: false,
    dropped: false,
  }],
}, {
  id: 'mock1',
  name: 'test1',
  category: 'cat1',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed molestie suscipit suscipit. Nullam sollicitudin tempus pretium.',
  date: new Date('2018-02-01'),
  done: true,
  staging: false,
  pairingMethod: api.pairingMethods.POINTS,
  pairingMethodInitial: api.pairingMethods.RANDOM,
  podSizeMinimum: 3,
  podSizeMaximum: 5,
  rounds: 2,
  players: [{
    id: 'mock0',
    name: 'test0',
    points: 0,
    participated: true,
    dropped: true,
    1: { pod: 1, points: 0 },
    2: { pod: 1, points: 0 },
  }, {
    id: 'mock1',
    name: 'test1',
    points: 1,
    participated: true,
    dropped: true,
    1: { pod: 1, points: 1 },
    2: { pod: 2, points: 1 },
  }, {
    id: 'mock2',
    name: 'test2',
    points: 2,
    participated: true,
    dropped: false,
    1: { pod: 1, points: 2 },
    2: { pod: 1, points: 2 },
  }, {
    id: 'mock3',
    name: 'test3',
    points: 3,
    participated: true,
    dropped: false,
    1: { pod: 2, points: 3 },
    2: { pod: 2, points: 3 },
  }, {
    id: 'mock4',
    name: 'test4',
    points: 4,
    participated: true,
    dropped: false,
    1: { pod: 2, points: 4 },
    2: { pod: 1, points: 4 },
  }, {
    id: 'mock5',
    name: 'test5',
    points: 5,
    participated: true,
    dropped: false,
    1: { pod: 2, points: 5 },
    2: { pod: 2, points: 5 },
  }, {
    id: 'mock6',
    name: 'test6',
    points: 6,
    participated: true,
    dropped: false,
    2: { pod: 2, points: 6 },
  }],
}, {
  id: 'mock2',
  name: 'test2',
  category: 'cat0',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris vitae tellus nunc. Sed ullamcorper metus vitae nisi rhoncus placerat.',
  date: new Date('2018-01-01'),
  done: false,
  staging: false,
  pairingMethod: api.pairingMethods.RANDOM,
  pairingMethodInitial: api.pairingMethods.RANDOM,
  podSizeMinimum: 3,
  podSizeMaximum: 4,
  rounds: 1,
  players: [{
    id: 'mock0',
    name: 'test0',
    points: 0,
    participated: true,
    dropped: false,
    1: { pod: 1, points: 0 },
  }, {
    id: 'mock1',
    name: 'test1',
    points: 1,
    participated: true,
    dropped: false,
    1: { pod: 1, points: 1 },
  }, {
    id: 'mock2',
    name: 'test2',
    points: 2,
    participated: true,
    dropped: false,
    1: { pod: 1, points: 2 },
  }, {
    id: 'mock3',
    name: 'test3',
    points: 3,
    participated: true,
    dropped: false,
    1: { pod: 1, points: 3 },
  }],
}];

const mockRoute = {
  history: {
    push: jest.fn(to => to),
    replace: jest.fn(to => to),
  },
  match: {
    params: {},
  },
  matchWithInvalid: {
    params: {
      id: 'invalid',
    },
  },
  matchWithID0: {
    params: {
      id: 'mock0',
    },
  },
  matchWithID1: {
    params: {
      id: 'mock1',
    },
  },
};

let mockStore = {};
const mockStorage = {
  setItem: jest.fn((key, val) => Promise.resolve((mockStore[key] = val))),
  getItem: jest.fn(key => Promise.resolve(mockStore[key])),
  removeItem: jest.fn(key => { delete mockStore[key]; Promise.resolve(); }),
  clear: jest.fn(() => Promise.resolve((mockStore = {}))),
  keys: jest.fn(() => Promise.resolve(Object.keys(mockStore))),
  length: jest.fn(() => Promise.resolve(Object.keys(mockStore).length)),
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
  mockRoute,
  mockStore,
  mockStorage,
  mockAPI,
  demockAPI,
};
