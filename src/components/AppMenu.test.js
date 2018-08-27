import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Modal from '@material-ui/core/Modal';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Drawer from '@material-ui/core/Drawer';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import AppMenu from './AppMenu';
import TournamentSettings from './TournamentSettings';

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

test('content', () => {
  const toolbar = <div id='test' />;
  const component = shallow(<AppMenu />).dive().dive();
  expect(component.find(AppBar).at(0).prop('position')).toBe('fixed');
  expect(component.find(AppBar).at(1).prop('position')).toBe('static');
  expect(component.find(Toolbar).at(0).find(Typography).dive().dive().text()).toBe('Point Pods');
  expect(component.find(Toolbar).at(1).find(Typography).dive().dive().text()).toBe('Menu');
  expect(component.find('#test').length).toBe(0);
  component.setProps({
    position: 'static',
    color: 'secondary',
    title: 'Test',
    toolbar: toolbar,
  });
  expect(component.find(AppBar).at(0).prop('position')).toBe('static');
  expect(component.find(AppBar).at(0).prop('color')).toBe('secondary');
  expect(component.find(AppBar).at(1).prop('position')).toBe('static');
  expect(component.find(AppBar).at(1).prop('color')).toBe(undefined);
  expect(component.find(Toolbar).at(0).find(Typography).dive().dive().text()).toBe('Test');
  expect(component.find(Toolbar).at(1).find(Typography).dive().dive().text()).toBe('Menu');
  expect(component.find('#test').length).toBe(1);
});

test('back button', () => {
  const spy = jest.fn(v => v);
  const component = shallow(<AppMenu />).dive().dive();
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

test('menu drawer', () => {
  const spy = jest.fn(v => v);
  const component = shallow(<AppMenu />).dive().dive();
  expect(component.find(Modal).length).toBe(1);
  expect(component.state('drawerOpen')).toBe(false);
  component.find(IconButton).at(0).simulate('click');
  expect(component.state('drawerOpen')).toBe(true);
  expect(component.find(ListItemText).length).toBe(5);
  expect(component.find(ListItemText).at(0).prop('primary')).toBe('Home');
  expect(component.find(ListItemText).at(1).prop('primary')).toBe('New Tournament');
  expect(component.find(ListItemText).at(2).prop('primary')).toBe('Tournaments');
  expect(component.find(ListItemText).at(3).prop('primary')).toBe('Players');
  expect(component.find(ListItemText).at(4).prop('primary')).toBe('Settings');
  expect(component.state('modalOpen')).toBe(false);
  expect(component.find(Modal).prop('open')).toBe(false);
  component.find(ListItem).at(1).simulate('click');
  expect(component.state('modalOpen')).toBe(true);
  expect(component.find(Modal).prop('open')).toBe(true);
});

test('new tournament modal', () => {
  const spy = jest.fn(v => v);
  const component = shallow(<AppMenu />).dive().dive();
  expect(component.find(Modal).find(TournamentSettings).length).toBe(1);
  expect(component.state('modalOpen')).toBe(false);
  expect(component.find(Modal).prop('open')).toBe(false);
  component.find(ListItem).at(1).simulate('click');
  expect(component.state('modalOpen')).toBe(true);
  expect(component.find(Modal).prop('open')).toBe(true);
  component.setProps({ onCancelNew: spy });
  component.find(TournamentSettings).find(Button).at(0).simulate('click');
  expect(component.state('modalOpen')).toBe(false);
  expect(component.find(Modal).prop('open')).toBe(false);
  expect(spy.mock.calls.length).toBe(1);
  component.setProps({ showNew: true });
  expect(component.state('modalOpen')).toBe(false);
  expect(component.find(Modal).prop('open')).toBe(true);
});
