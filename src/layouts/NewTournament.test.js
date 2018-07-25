import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import NewTournament from './NewTournament';

import { mockRoute } from '../testData';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<NewTournament />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  let component = renderer.create(<NewTournament />);
  expect(component.toJSON()).toMatchSnapshot();
  component = renderer.create(<NewTournament history={mockRoute.history} match={mockRoute.matchWithID1}/>);
  expect(component.toJSON()).toMatchSnapshot();
});
