import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

import CardHeader from '@material-ui/core/CardHeader';

import TournamentSettings from './TournamentSettings';

import api from '../api';

import { testSettings, testTournaments, mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TournamentSettings />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const component = renderer.create(<TournamentSettings />);
  expect(component.toJSON()).toMatchSnapshot();
    component.update(<TournamentSettings />);
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
  const component = shallow(<TournamentSettings />);
  expect(component.type().prototype.constructor.name).toBe('APIComponent');
  expect(component.dive().type().prototype.constructor.name).toBe('TournamentSettings');
});

test('title prop', () => {
  const component = shallow(<TournamentSettings />);
  const unHOC = component.dive().dive();
  expect(unHOC.find(CardHeader).length).toBe(0);
  unHOC.setProps({ title: 'Test' });
  expect(unHOC.find(CardHeader).length).toBe(1);
  expect(unHOC.find(CardHeader).prop('title')).toBe('Test');
})

describe('default values', () => {
  test('sets the date to today', () => {
    const date = new Date().toJSON().slice(0,10);
    const component = shallow(<TournamentSettings />);
    const unHOC = component.dive().dive();
    expect(unHOC.state('date')).toBe(date);
    expect(unHOC.find('#tournament-date').prop('value')).toBe(date);
  });

  test('loads the tournament categories', (done) => {
    const categories = testTournaments
      .map(tournament => tournament.category)
      .filter((value, index, self) => self.indexOf(value) === index);
    const component = shallow(<TournamentSettings />);
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
    const component = shallow(<TournamentSettings />);
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
    const component = shallow(<TournamentSettings />);
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

  test('submit button is clicked', (done) => {
    const spy = jest.fn(r => r);
    const component = shallow(<TournamentSettings onSubmit={spy} />);
    const unHOC = component.dive().dive();
    unHOC.find('#tournament-submit').simulate('click');
    setTimeout(() => {
      try {
        expect(spy.mock.calls.length).toBe(0);
        unHOC.setState({ name: 'test' });
        unHOC.find('#tournament-submit').simulate('click');
        setTimeout(() => {
          try {
            expect(spy.mock.calls.length).toBe(1);
            expect(spy.mock.calls[0][0].id).toBe(testTournaments[testTournaments.length - 1].id);
            expect(spy.mock.calls[0][0].name).toBe(testTournaments[testTournaments.length - 1].name);
            expect(spy.mock.calls[0][0].category).toBe(testTournaments[testTournaments.length - 1].category);
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

describe('with id prop', () => {
  test('loads the tournament settings', (done) => {
    const component = shallow(<TournamentSettings id='mock1' />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      try {
        Object.keys(testTournaments[1]).forEach(key => {
          expect(unHOC.state(key)).toEqual(testTournaments[1][key]);
        });
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });

  test('submit button is clicked', (done) => {
    const spy = jest.fn(r => r);
    const component = shallow(<TournamentSettings onSubmit={spy} id='mock0' />);
    const unHOC = component.dive().dive();
    unHOC.find('#tournament-submit').simulate('click');
    setTimeout(() => {
      try {
        expect(spy.mock.calls.length).toBe(0);
        unHOC.setState({ name: 'test' });
        unHOC.find('#tournament-submit').simulate('click');
        setTimeout(() => {
          try {
            expect(spy.mock.calls.length).toBe(1);
            expect(spy.mock.calls[0][0].id).toBe(testTournaments[0].id);
            expect(spy.mock.calls[0][0].name).toBe(unHOC.state().name);
            expect(spy.mock.calls[0][0].category).toBe(testTournaments[0].category);
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

test('adding a new category');
