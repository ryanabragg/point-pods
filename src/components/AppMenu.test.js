import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import AppMenu from './AppMenu';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppMenu />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const tree = renderer.create(<AppMenu />);
  const toolbar = <div><button>test</button></div>;
  expect(tree.toJSON()).toMatchSnapshot();
  tree.update(<AppMenu position='static' />);
  expect(tree.toJSON()).toMatchSnapshot();
  tree.update(<AppMenu title='Test' toolbar={toolbar} />);
  expect(tree.toJSON()).toMatchSnapshot();
});
