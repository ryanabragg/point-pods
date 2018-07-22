import localforage from 'localforage';
import React from 'react';

const api = {
  store: localforage.createInstance({
    name: 'Point Pods',
    storeName: 'point_pods',
    description: 'some description'
  }),
};

export default api;
export function withAPI(Component) {
  return function APIComponent(props) {
    return <Component {...props} api={api} />;
  };
};
