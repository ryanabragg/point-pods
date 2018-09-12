import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import MoreVertIcon from '@material-ui/icons/MoreVert';

import MenuButton from './MenuButton';

const items = [
  { label: 'One', action: jest.fn(v => 'One') },
  { label: 'Two', action: jest.fn(v => 'Two') },
  { label: 'Three', action: jest.fn(v => 'Three') },
];

const itemsWithIcons = [
  { label: 'One', icon: <MoreVertIcon />, action: jest.fn(v => 'One') },
  { label: 'Two', icon: <MoreVertIcon />, action: jest.fn(v => 'Two') },
  { label: 'Three', icon: <MoreVertIcon />, action: jest.fn(v => 'Three') },
];

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MenuButton />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const component = renderer.create(<MenuButton />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<MenuButton buttonContent='test' />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<MenuButton buttonProps={{color: 'inherit'}} buttonContent={<MoreVertIcon />} />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<MenuButton menuItems={items} />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<MenuButton menuItems={itemsWithIcons} />);
  expect(component.toJSON()).toMatchSnapshot();
});

test('menu button', () => {
  const component = shallow(<MenuButton />).dive();
  expect(component.find(Button).length).toBe(1);
  expect(component.find(IconButton).length).toBe(0);
  expect(component.find(Button).prop('children')).toBe('button');
  component.setProps({
    buttonContent: 'test',
  });
  expect(component.find(Button).prop('children')).toBe('test');
  component.setProps({
    buttonType: 'icon',
    buttonContent: <MoreVertIcon />,
    buttonProps: { color: 'inherit' },
  });
  expect(component.find(Button).length).toBe(0);
  expect(component.find(IconButton).length).toBe(1);
  expect(component.find(IconButton).prop('children')).toEqual(<MoreVertIcon />);
  expect(component.find(IconButton).prop('color')).toBe('inherit');
  expect(component.state('open')).toBe(false);
  component.find(IconButton).simulate('click');
  expect(component.state('open')).toBe(true);
});

test('menu list'/*, () => {
  const component = shallow(<MenuButton menuItems={items} />).dive();
  component.find(Button).simulate('click');
  console.log(component.props())
  expect(component.find(MenuItem).length).toBe(items.length);
  component.setProps({
    menuItems: itemsWithIcons,
  });
  expect(component.find(ListItemIcon).length).toBe(itemsWithIcons.length);
  expect(component.find(ListItemText).length).toBe(itemsWithIcons.length);
}*/);

test('className prop', () => {
  const component = shallow(<MenuButton />).dive();
  expect(component.find('div').prop('className')).toBe('');
  component.setProps({className: 'test'})
  expect(component.find('div').prop('className')).toBe('test');
});

test('disablePortal prop pass-through', () => {
  const component = shallow(<MenuButton />).dive();
  expect(component.find(Popper).prop('disablePortal')).toBe(false);
  component.setProps({
    disablePortal: true,
  });
  expect(component.find(Popper).prop('disablePortal')).toBe(true);
});

test('paperStyle prop pass-through'/*, () => {
  const component = shallow(<MenuButton buttonContent='test' menuItems={items}/>).dive();
  component.setState({open: true});
  component.update();
  expect(component.find(Paper).prop('className')).toBe('');
  const style = 'maxHeight: 200; overflow: auto';
  component.setProps({
    paperStyle: style,
  });
  expect(component.find(Paper).prop('className')).toBe(style);
}*/);
