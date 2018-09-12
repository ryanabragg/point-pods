import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import SwipeTabControl from './SwipeTabControl';

const testTabs = [
  { key: 't1', label: 'tab1' },
  { key: 't2', label: 'tab2' },
  { key: 't3', label: 'tab3' },
];

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SwipeTabControl />, div);
  ReactDOM.unmountComponentAtNode(div);
});

/* TypeError: Cannot read property 'addEventListener' of null
test('matches the prior snapshot', () => {
  const component = renderer.create(
    <SwipeTabControl tabs={[{key:1,label:'tab1'},{key:2,label:'tab2'}]}>
      <div>1</div>
      <div>2</div>
    </SwipeTabControl>
  );
  expect(component.toJSON()).toMatchSnapshot();
});*/

describe('integration', () => {
  test('Tabs', () => {
    const component = shallow(<SwipeTabControl />).dive();
    expect(component.find(Tabs).length).toBe(1);
    expect(component.find(Tab).length).toBe(0);
    component.setProps({ tabs: testTabs });
    expect(component.find(Tab).length).toBe(3);
  });

  test('SwipeableViews', () => {
    const component = shallow(<SwipeTabControl />).dive();
    expect(component.find(SwipeableViews).length).toBe(1);
    expect(component.find(SwipeableViews).find('div').length).toBe(0);
    component.setProps({ tabs: testTabs });
    expect(component.find(SwipeableViews).find('div').length).toBe(3);
  });
});

test('tab bar position', () => {
  const component = shallow(
    <SwipeTabControl 
      tabs={[
        {key: 'one', label: 'One'},
        {key: 'two', label: 'Two'},
        {key: 'three', label: 'Three'},
      ]}
    />
  ).dive();
  expect(component.childAt(0).type()).toEqual(SwipeableViews);
  expect(component.childAt(1).type()).toEqual(Tabs);
  component.setProps({ tabsOnBottom: false });
  expect(component.childAt(0).type()).toEqual(Tabs);
  expect(component.childAt(1).type()).toEqual(SwipeableViews);
});

describe('defaults', () => {
  test('tab index', () => {
    const component = shallow(
      <SwipeTabControl 
        tabs={[
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'},
        ]}
      />
    ).dive();
    expect(component.state('tabIndex')).toBe(0);
  });
});

describe('actions', () => {
  test('goToTab', () => {
    const component = shallow(
      <SwipeTabControl 
        tabs={[
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'},
        ]}
        goToTab={1}
      />
    ).dive();
    expect(component.state('tabIndex')).toBe(1);
    component.setProps({
      goToTab: 2
    });
    expect(component.state('tabIndex')).toBe(2);
  });

  test('onChange', () => {
    const spy = jest.fn();
    const component = shallow(
      <SwipeTabControl 
        tabs={[
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'},
        ]}
        onChange={spy}
      />
    ).dive();
    component.setProps({
      goToTab: 2
    });
    expect(spy.mock.calls[0][0]).toBe(2);
    expect(component.find(Tabs).prop('onChange')).toEqual(component.instance().handleChange);
    component.instance().handleChange({}, 1);
    expect(spy.mock.calls[1][0]).toBe(1);
    expect(component.find(SwipeableViews).prop('onChangeIndex')).toEqual(component.instance().handleChangeIndex);
    component.instance().handleChangeIndex(0);
    expect(spy.mock.calls[2][0]).toBe(0);
  })
});

test('className prop', () => {
  const component = shallow(
    <SwipeTabControl 
      tabs={[
        {key: 'one', label: 'One'},
        {key: 'two', label: 'Two'},
      ]}
    />
  ).dive();
  expect(component.find('div').at(0).prop('className')).toBe('SwipeTabControl-root-16');
  component.setProps({className: 'test'})
  expect(component.find('div').at(0).prop('className')).toBe('SwipeTabControl-root-16 test');
});

test('printing', () => {
  const component = shallow(
    <SwipeTabControl 
      tabs={[
        {key: 'one', label: 'One'},
        {key: 'two', label: 'Two'},
      ]}
    />
  ).dive();
  expect(component.find(Tabs).prop('className')).toBe('SwipeTabControl-tabBar-17');
  component.setProps({ hideTabsOnPrint: true });
  expect(component.find(Tabs).prop('className')).toBe('SwipeTabControl-tabBar-17 SwipeTabControl-hideOnPrint-18');
});
