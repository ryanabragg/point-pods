import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

import TournamentCreation from './TournamentCreation';

import api from '../api';

import { testSettings, testTournaments, mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TournamentCreation />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const component = renderer.create(<TournamentCreation />);
  expect(component.toJSON()).toMatchSnapshot();
    component.update(<TournamentCreation />);
  setTimeout(() => {
    try {
      expect(component.toJSON()).toMatchSnapshot();
      done();
    } catch (error) {
      done.fail(error);
    }
  }, 100);
});

test('is a HOC-ed component', () => {
  const component = shallow(<TournamentCreation />);
  expect(component.type().prototype.constructor.name).toBe('APIComponent');
  expect(component.dive().type().prototype.constructor.name).toBe('TournamentCreation');
});

describe('default values', () => {
  test('sets the date to today', () => {
    const date = new Date().toJSON().slice(0,10);
    const component = shallow(<TournamentCreation />);
    const unHOC = component.dive().dive();
    expect(unHOC.state('date')).toBe(date);
    expect(unHOC.find('#tournament-date').prop('value')).toBe(date);
  });

  test('loads the tournament categories', (done) => {
    const categories = testTournaments
      .map(tournament => tournament.category)
      .filter((value, index, self) => self.indexOf(value) === index);
    const component = shallow(<TournamentCreation />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      try {
        expect(unHOC.state('categories')).toEqual(categories);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });

  test('loads the pod sorting options', (done) => {
    let methodsArray = Object.keys(api.pairingMethods)
      .map(key => ({
        label: key.slice(0,1).toUpperCase() + key.slice(1).toLowerCase(),
        value: api.pairingMethods[key]
      }));
    const component = shallow(<TournamentCreation />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      try {
        expect(unHOC.state('pairingMethods')).toEqual(methodsArray);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });

  test('loads the api tournament settings', (done) => {
    const component = shallow(<TournamentCreation />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      try {
        expect(unHOC.state('pairingMethod')).toBe(testSettings.pairingMethod);
        expect(unHOC.state('pairingMethodInitial')).toBe(testSettings.pairingMethodInitial);
        expect(unHOC.state('podSizeMinimum')).toBe(testSettings.podSizeMinimum);
        expect(unHOC.state('podSizeMaximum')).toBe(testSettings.podSizeMaximum);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });
});

describe('actions', () => {
  test('calls onSubmit prop when the Create button is clicked', (done) => {
    const spy = jest.fn(r => r);
    const component = shallow(<TournamentCreation onSubmit={spy} />);
    const unHOC = component.dive().dive();
    unHOC.find('#tournament-create').simulate('click');
    setTimeout(() => {
      try {
        expect(spy.mock.calls.length).toBe(0);
        unHOC.setState({ name: 'test' });
        unHOC.find('#tournament-create').simulate('click');
        setTimeout(() => {
          try {
            expect(spy.mock.calls.length).toBe(1);
            expect(spy.mock.calls[0][0].name).toEqual(unHOC.state().name);
            done();
          } catch (error) {
            done.fail(error);
          }
        }, 100);
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });

  test('adding a category', (done) => {
    const categories = testTournaments
      .map(tournament => tournament.category)
      .filter((cat, i, self) => cat && self.indexOf(cat) === i)
      .sort();
    const component = shallow(<TournamentCreation />);
    const unHOC = component.dive().dive();
    unHOC.find('#tournament-newCategory-add').simulate('click');
    setTimeout(() => {
      try {
        expect(unHOC.state('category')).toEqual('');
        expect(unHOC.state('categories')).toEqual(categories);
        unHOC.setState({ name: 'test' });
        unHOC.find('#tournament-newCategory').simulate('change', {target: {value: 'test'}});
        unHOC.find('#tournament-newCategory-add').simulate('click');
        setTimeout(() => {
          try {
            expect(unHOC.state('category')).toEqual('test');
            expect(unHOC.state('categories')).toEqual(categories.concat('test'));
            done();
          } catch (error) {
            done.fail(error);
          }
        }, 100);
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });
});
