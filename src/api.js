import localforage from 'localforage';

const api = {
  store: localforage.createInstance({
    name: 'Point Pods',
    storeName: 'point_pods',
    description: 'some description'
  }),
};

export default api;
