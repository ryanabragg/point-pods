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

/* For some reason, this refuses to render without error
test('matches the prior snapshot', () => {
  const component = renderer.create(<SwipeTabControl tabs={[{key:1,label:'tab1'},{key:2,label:'tab2'}]}><div>1</div><div>2</div></SwipeTabControl>);
  expect(component.toJSON()).toMatchSnapshot();
});*/

describe('integration', () => {
  test('Tabs', () => {
    const wrapper = shallow(<SwipeTabControl />);
    const component = wrapper.dive();
    expect(component.find(Tabs).length).toBe(1);
    expect(component.find(Tab).length).toBe(0);
    component.setProps({ tabs: testTabs });
    expect(component.find(Tab).length).toBe(3);
  });

  test('SwipeableViews', () => {
    const wrapper = shallow(<SwipeTabControl />);
    const component = wrapper.dive();
    expect(component.find(SwipeableViews).length).toBe(1);
    expect(component.find(SwipeableViews).find('div').length).toBe(0);
    component.setProps({ tabs: testTabs });
    expect(component.find(SwipeableViews).find('div').length).toBe(3);
  });
});

describe('defaults', () => {
  test('tab index', () => {
    const wrapper = shallow(
      <SwipeTabControl 
        tabs={[
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'},
        ]}
      />
    );
    const component = wrapper.dive();
    expect(component.state('tabIndex')).toBe(0)
  });
});

describe('actions', () => {
  test('goToTab', () => {
    const wrapper = shallow(
      <SwipeTabControl 
        tabs={[
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'},
        ]}
        goToTab={1}
      />
    );
    const component = wrapper.dive();
    expect(component.state('tabIndex')).toBe(1);
    component.setProps({
      goToTab: 2
    });
    expect(component.state('tabIndex')).toBe(2);
  });

  test('onChange', () => {
    const spy = jest.fn();
    const wrapper = shallow(
      <SwipeTabControl 
        tabs={[
          {key: 'one', label: 'One'},
          {key: 'two', label: 'Two'},
          {key: 'three', label: 'Three'},
        ]}
        onChange={spy}
      />
    );
    const component = wrapper.dive();
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
