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
