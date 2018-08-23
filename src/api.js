import localforage from 'localforage';
import React from 'react';

const api = {
  store: localforage.createInstance({
    name: 'Point Pods'
  }),
  pairingMethods: {
    RANDOM: -1,
    POINTS: 0,
    HISTORIC: 1,
  },
  Settings: {},
  Players: {},
  Tournaments: {},
};

api.Settings.default = () => Promise.resolve({
  pairingMethod: api.pairingMethods.POINTS,
  pairingMethodInitial: api.pairingMethods.RANDOM,
  podSizeMinimum: 3,
  podSizeMaximum: 4,
});

api.Settings.get = () => api.store.keys()
  .then(keys => {
    if(-1 === keys.indexOf('settings'))
      return api.store.setItem('settings', api.Settings.default());
    return api.store.getItem('settings');
  });

api.Settings.set = (settings) => {
  return api.Settings.get().then(values => {
    const validKeys = Object.keys(values);
    const badKeys = Object.keys(settings).filter(k => !validKeys.includes(k));
    badKeys.forEach(key => delete settings.key);
    return api.store.setItem('settings', Object.assign({}, values, settings));
  });
};

api.Players.all = () => api.store.keys()
  .then(keys => {
    if(-1 === keys.indexOf('players'))
      return api.store.setItem('players', []);
    return api.store.getItem('players');
  });

api.Players.get = (id) => {
  return api.Players.all().then(list => {
    const found = list.filter(i => String(i.id) === String(id));
    if(!found.length)
      throw new Error('ID not found');
    return found[0];
  });
};

api.Players.set = (value) => {
  const create = !value.hasOwnProperty('id');
  const defaultValue = {
    id: Date.now(),
    name: '',
    points: 0,
  };
  const validKeys = Object.keys(defaultValue);
  const badKeys = Object.keys(value).filter(key => !validKeys.includes(key));
  badKeys.forEach(key => delete value.key);
  return api.Players.all().then(list => {
    let index = list.findIndex(i => String(i.id) === String(value.id));
    if(create && index === -1)
      index = list.push(Object.assign({}, defaultValue, value)) - 1;
    else if(index === -1)
      throw new Error('ID not found');
    list[index] = Object.assign({}, list[index], value);
    return api.store.setItem('players', list).then(list => list[index]);
  });
};

api.Players.remove = (id) => {
  if(!id)
    return Promise.reject('Invalid ID');
  return api.Players.all().then(list => {
    const index = list.findIndex(i => String(i.id) === String(id));
    if(index === -1)
      throw new Error('ID not found');
    list.splice(index, 1);
    return api.store.setItem('players', list);
  });
};

api.Tournaments.all = () => api.store.keys()
  .then(keys => {
    if(-1 === keys.indexOf('tournaments'))
      return api.store.setItem('tournaments', []);
    return api.store.getItem('tournaments');
  });

api.Tournaments.get = (id) => {
  return api.Tournaments.all().then(list => {
    const found = list.filter(i => String(i.id) === String(id));
    if(!found.length)
      throw new Error('ID not found');
    return found[0];
  });
};

api.Tournaments.set = (value) => {
  const create = !value.hasOwnProperty('id');
  const defaultValue = {
    id: Date.now(),
    name: '',
    category: '',
    description: '',
    date: '',
    pairingMethod: null,
    pairingMethodInitial: null,
    podSizeMinimum: null,
    podSizeMaximum: null,
    rounds: 0,
    done: false,
    staging: true,
    players: [],
  };
  const validKeys = Object.keys(defaultValue);
  const badKeys = Object.keys(value).filter(key => !validKeys.includes(key));
  badKeys.forEach(key => delete value.key);
  return api.Tournaments.all().then(list => {
    let index = list.findIndex(i => String(i.id) === String(value.id));
    if(create && index === -1)
      index = list.push(Object.assign({}, defaultValue, value)) - 1;
    else if(index === -1)
      throw new Error('ID not found');
    else
      list[index] = Object.assign({}, list[index], value);
    return api.store.setItem('tournaments', list).then(list => list[index]);
  });
};

api.Tournaments.remove = (id) => {
  if(!id)
    return Promise.reject('Invalid ID');
  return api.Tournaments.all().then(list => {
    const index = list.findIndex(i => String(i.id) === String(id));
    if(index === -1)
      throw new Error('ID not found');
    list.splice(index, 1);
    return api.store.setItem('tournaments', list);
  });
};

export default api;
export function withAPI(WrappedComponent) {
  return function APIComponent(props) {
    return <WrappedComponent {...props} api={api} />;
  };
};
