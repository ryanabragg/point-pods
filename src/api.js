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
export const APIContext = React.createContext(api);
export function withAPI(Component) {
  return function APIComponent(props) {
    return (
      <APIContext.Consumer>
        {context => <Component {...props} api={context} />}
      </APIContext.Consumer>
    );
  };
}
