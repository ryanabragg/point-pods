import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import AppMenu from './AppMenu';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppMenu />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const component = renderer.create(<AppMenu />);
  const toolbar = <div><button>test</button></div>;
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<AppMenu position='static' />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<AppMenu title='Test' toolbar={toolbar} usesBackIcon />);
  expect(component.toJSON()).toMatchSnapshot();
});

describe('props', () => {
  test('content', () => {
    const toolbar = <div id='test' />;
    const wrapper = shallow(<AppMenu />);
    const component = wrapper.dive();
    expect(component.find(AppBar).at(0).prop('position')).toBe('fixed');
    expect(component.find(AppBar).at(1).prop('position')).toBe('static');
    expect(component.find(Toolbar).at(0).find(Typography).dive().dive().text()).toBe('Point Pods');
    expect(component.find(Toolbar).at(1).find(Typography).dive().dive().text()).toBe('Menu');
    expect(component.find('#test').length).toBe(0);
    component.setProps({
      position: 'static',
      title: 'Test',
      toolbar: toolbar,
    });
    expect(component.find(AppBar).at(0).prop('position')).toBe('static');
    expect(component.find(AppBar).at(1).prop('position')).toBe('static');
    expect(component.find(Toolbar).at(0).find(Typography).dive().dive().text()).toBe('Test');
    expect(component.find(Toolbar).at(1).find(Typography).dive().dive().text()).toBe('Menu');
    expect(component.find('#test').length).toBe(1);
  });

  test('back button', () => {
    const spy = jest.fn(v => v);
    const wrapper = shallow(<AppMenu />);
    const component = wrapper.dive();
    expect(component.find(IconButton).at(0).prop('aria-label')).toBe('Menu');
    expect(component.find(IconButton).at(1).prop('aria-label')).toBe('Menu-Close');
    component.setProps({
      usesBackIcon: true,
      onBack: spy,
    });
    expect(component.find(IconButton).at(0).prop('aria-label')).toBe('Back');
    expect(component.find(IconButton).at(1).prop('aria-label')).toBe('Menu-Close');
    component.find(IconButton).at(0).simulate('click');
    expect(spy.mock.calls.length).toBe(1);
  });
});
