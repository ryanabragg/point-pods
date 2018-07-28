import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Card from '@material-ui/core/Card';

import TournamentCardList from './TournamentCardList';

import api from '../api';

import { testTournaments, mockStore, mockStorage, mockAPI, demockAPI } from '../testData';

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
  }, 100);
});

test('is a HOC-ed component', () => {
  const component = shallow(<TournamentCardList />);
  expect(component.type().prototype.constructor.name).toBe('APIComponent');
  expect(component.dive().type().prototype.constructor.name).toBe('TournamentCardList');
});

test('loading', (done) => {
  const spy = jest.fn(v => v);
  const categories = testTournaments.map(t => t.category)
    .filter((cat, i, self) => cat && self.indexOf(cat) === i).sort();
  const component = shallow(<TournamentCardList onLoadCategories={spy} />);
  const unHOC = component.dive().dive();
  setTimeout(() => {
    try{
      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toEqual(categories);
      done();
    } catch(error) {
      done.fail(error);
    }
  }, 100);
});

test('notification', (done) => {
  mockStore.tournaments = null;
  const spy = jest.fn(v => v);
  const component = shallow(<TournamentCardList notification={spy} />);
  const unHOC = component.dive().dive();
  setTimeout(() => {
    try{
      expect(spy.mock.calls.length).toBe(1);
      expect(spy.mock.calls[0][0]).toBe(`Cannot read property 'map' of null`);
      done();
    } catch(error) {
      done.fail(error);
    }
  }, 100);
});

test('onSelect');

describe('control props', () => {
  test('status', (done) => {
    const component = shallow(<TournamentCardList />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      unHOC.update();
      try{
        expect(unHOC.find(Card).length).toBe(testTournaments.length);
        unHOC.setProps({
          category: '',
          status: 'Pending',
        });
        expect(unHOC.find(Card).length).toBe(1);
        expect(unHOC.find(Card).prop('id')).toBe('mock0');
        unHOC.setProps({
          status: 'In Progress',
        });
        expect(unHOC.find(Card).length).toBe(1);
        expect(unHOC.find(Card).prop('id')).toBe('mock2');
        unHOC.setProps({
          status: 'Incomplete',
        });
        expect(unHOC.find(Card).length).toBe(2);
        expect(unHOC.find(Card).at(0).prop('id')).toBe('mock0');
        expect(unHOC.find(Card).at(1).prop('id')).toBe('mock2');
        unHOC.setProps({
          status: 'Complete',
        });
        expect(unHOC.find(Card).length).toBe(1);
        expect(unHOC.find(Card).prop('id')).toBe('mock1');
        done();
      } catch(error) {
        done.fail(error);
      }
    }, 100);
  });

  test('category', (done) => {
    const component = shallow(<TournamentCardList />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      unHOC.update();
      try{
        expect(unHOC.find(Card).length).toBe(testTournaments.length);
        unHOC.setProps({
          category: 'cat0',
        });
        expect(unHOC.find(Card).length).toBe(2);
        expect(unHOC.find(Card).at(0).prop('id')).toBe('mock0');
        expect(unHOC.find(Card).at(1).prop('id')).toBe('mock2');
        unHOC.setProps({
          category: 'cat1',
        });
        expect(unHOC.find(Card).length).toBe(1);
        expect(unHOC.find(Card).prop('id')).toBe('mock1');
        done();
      } catch(error) {
        done.fail(error);
      }
    }, 100);
  });

  test('search', (done) => {
    const search = [{
      term: 'test2',
      expect: [ 'mock2' ],
    }, {
      term: 'dolor sit amet',
      expect: [ 'mock0', 'mock1', 'mock2' ],
    }, {
      term: 'mauris vitae',
      expect: [ 'mock0', 'mock2' ],
    }, {
      term: 'suscipit',
      expect: [ 'mock1' ],
    }];
    const component = shallow(<TournamentCardList />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      unHOC.update();
      try{
        expect(unHOC.find(Card).length).toBe(testTournaments.length);
        search.forEach((find, index) => {
          unHOC.setProps({
            search: find.term,
          });
          expect(unHOC.find(Card).length).toBe(find.expect.length);
          unHOC.find(Card).forEach((node, i) => {
            expect(node.prop('id')).toBe(find.expect[i]);
          });
        });
        done();
      } catch(error) {
        done.fail(error);
      }
    }, 100);
  });

  test('no results', (done) => {
    const component = shallow(<TournamentCardList />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      unHOC.update();
      try{
        expect(unHOC.find(Card).length).toBe(testTournaments.length);
        unHOC.setProps({
          category: 'not-found'
        });
        expect(unHOC.find(Card).length).toBe(1);
        expect(unHOC.find(Card).prop('id')).toBe('not-found');
        done();
      } catch(error) {
        done.fail(error);
      }
    }, 100);
  });
});
