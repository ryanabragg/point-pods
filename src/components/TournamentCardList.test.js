import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

import TournamentCardList from './TournamentCardList';

import api from '../api';

import { mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TournamentCardList />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const tree = renderer.create(<TournamentCardList />);
  expect(tree.toJSON()).toMatchSnapshot();
  setTimeout(() => {
    tree.update(<TournamentCardList />);
    expect(tree.toJSON()).toMatchSnapshot();
    done();
  }, 1000);
});

test('has control props: filterByDone, done', (done) => {
  const tree = renderer.create(<TournamentCardList />);
  setTimeout(() => {
    tree.update(<TournamentCardList filterByDone={true} />);
    expect(tree.toJSON()).toMatchSnapshot();
    tree.update(<TournamentCardList filterByDone={true} done={true} />);
    expect(tree.toJSON()).toMatchSnapshot();
    done();
  }, 1000);
});