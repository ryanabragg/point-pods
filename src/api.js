import localforage from 'localforage';
import React from 'react';

const api = {
  store: localforage.createInstance({
    name: 'Point Pods',
    storeName: 'point_pods',
    description: 'some description'
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

api.Settings.get = () => api.store.getItem('settings')
  .catch(error => api.Settings.default());

api.Settings.set = (settings) => {
  return api.Settings.get().then(values => {
    if(settings.hasOwnProperty('pairingMethod'))
      values.pairingMethod = settings.pairingMethod;
    if(settings.hasOwnProperty('pairingMethodInitial'))
      values.pairingMethodInitial = settings.pairingMethodInitial;
    if(settings.hasOwnProperty('podSizeMinimum'))
      values.podSizeMinimum = settings.podSizeMinimum;
    if(settings.hasOwnProperty('podSizeMaximum'))
      values.podSizeMaximum = settings.podSizeMaximum;
    return api.store.setItem('settings', values);
  });
};

api.Players.all = () => api.store.getItem('players')
  .catch(error => []);

api.Players.get = (id) => {
  return api.Players.all().then(list => {
    const found = list.filter(i => String(i.id) === String(id));
    if(!found.length)
      throw new Error('ID not found');
    return found[0];
  });
};

api.Players.set = (value) => {
  if(!value.id)
    return Promise.reject('Invalid ID');
  return api.Players.all().then(list => {
    const index = list.findIndex(i => String(i.id) === String(value.id));
    if(index === -1)
      throw new Error('ID not found');
    list[index] = Object.assign({}, list[index], value);
    return api.store.setItem('players', list);
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

api.Tournaments.all = () => api.store.getItem('tournaments')
  .catch(error => []);

api.Tournaments.get = (id) => {
  return api.Tournaments.all().then(list => {
    const found = list.filter(i => String(i.id) === String(id));
    if(!found.length)
      throw new Error('ID not found');
    return found[0];
  });
};

api.Tournaments.set = (value) => {
  if(!value.id)
    return Promise.reject('Invalid ID');
  return api.Tournaments.all().then(list => {
    const index = list.findIndex(i => String(i.id) === String(value.id));
    if(index === -1)
      throw new Error('ID not found');
    list[index] = Object.assign({}, list[index], value);
    return api.store.setItem('tournaments', list);
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
export function withAPI(Component) {
  return function APIComponent(props) {
    return <Component {...props} api={api} />;
  };
};
