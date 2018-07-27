import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Notification, { NotificationContext, withNotification } from './Notification';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Notification />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const component = renderer.create(<Notification />);
  expect(component.toJSON()).toMatchSnapshot();
});

test('renders children in a context provider', () => {
  const component = shallow(<Notification>
      <div />
      <ul>
        <li>one</li>
        <li>two</li>
      </ul>
    </Notification>
  );
  expect(component.type().prototype.constructor.name).toBe('Notification');
  expect(component.dive().type()).toEqual(React.Fragment);
  expect(component.dive().childAt(0).type()['$$typeof']).toEqual(React.createContext().Provider['$$typeof']);
  expect(component.dive().childAt(0).childAt(0).type()).toBe('div');
  expect(component.dive().childAt(0).childAt(1).type()).toBe('ul');
});

test('provides a HOC to wrap components in the context consumer', () => {
  const Test = withNotification(props => (<i>Test</i>));
  const WithContext = props => (
    <NotificationContext.Provider value='test1'>
      <Test id='test2' />
    </NotificationContext.Provider>
  );
  const component = shallow(<Test />);
  expect(component.type()['$$typeof']).toEqual(React.createContext().Consumer['$$typeof']);
  const componentRenderer = renderer.create(<WithContext />);
  expect(componentRenderer.root.children[0].type.prototype.constructor.name).toBe('NotificationEnabledComponent');
  expect(componentRenderer.root.children[0].children[0].props.notification).toBe('test1');
  expect(componentRenderer.root.children[0].children[0].props.id).toBe('test2');
  expect(componentRenderer.root.children[0].children[0].children[0].type).toBe('i');
});

describe('actions', () => {
  test('add default notification');
  test('add success notification');
  test('add warning notification');
  test('add error notification');
  test('add info notification');
  test('notifications time out unless duration is null');
  test('onClose prop fires when notifications timeout or are closed');
});
