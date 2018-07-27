import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import TournamentParticipants from './TournamentParticipants';
import IntegrationAutosuggest from './IntegrationAutosuggest';

import api from '../api';

import { testPlayers, testTournaments, mockStorage, mockAPI, demockAPI, mockRoute } from '../testData';

beforeEach(() => {
  mockAPI(api, mockStorage);
  mockRoute.history.push.mockClear();
  mockRoute.history.replace.mockClear();
});
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TournamentParticipants />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const component = renderer.create(<TournamentParticipants />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<TournamentParticipants id='mock0' />);
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
  const component = shallow(<TournamentParticipants id='mock0' />);
  expect(component.type().prototype.constructor.name).toBe('APIComponent');
  expect(component.dive().type().prototype.constructor.name).toBe('TournamentParticipants');
});

describe('default values', () => {
  test('loads the state', (done) => {
    const component = shallow(<TournamentParticipants id='mock1' />);
    const unHOC = component.dive().dive();
    setTimeout(() => {
      try {
        expect(unHOC.state('id')).toBe(testTournaments[1].id);
        expect(unHOC.state('players')).toEqual(testPlayers);
        expect(unHOC.state('participants')).toEqual(testTournaments[1].players);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });
});

describe('actions', () => {
  test('adding a player', (done) => {
    const ignoreVariance = player => ({
      id: player.id,
      name: player.name,
    });
    const playerSort = (a, b) => {
      if(a.name < b.name)
        return -1;
      else if(a.name > b.name)
        return 1;
      return 0;
    };
    let players = testTournaments[0].players.map(ignoreVariance);
    const spy = jest.fn((m, v, d, c) => null);
    const component = shallow(<TournamentParticipants id='mock0' notification={spy} />);
    const unHOC = component.dive().dive();
    expect(unHOC.find(IntegrationAutosuggest).prop('onSelect')).toEqual(unHOC.instance().handleSelect);
    let nextPlayer = {
      id: testPlayers[8].id,
      name: testPlayers[8].name,
    };
    setTimeout(() => {
      unHOC.instance().handleSelect({
        id: nextPlayer.id,
        label: nextPlayer.name,
      }).then(() => {
        try {
          players.push(nextPlayer);
          expect(testTournaments[0].players.map(ignoreVariance)).toEqual(players.sort(playerSort));
          expect(unHOC.state('participants')).toEqual(testTournaments[0].players);
          expect(spy.mock.calls[0][0]).toBe(`Added player ${nextPlayer.name}`);
          expect(spy.mock.calls[0][1]).toBe(`info`);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    }, 100);
  });

  test('adding a new player', (done) => {
    const ignoreVariance = player => ({
      id: player.id,
      name: player.name,
    });
    const playerSort = (a, b) => {
      if(a.name < b.name)
        return -1;
      else if(a.name > b.name)
        return 1;
      return 0;
    };
    let players = testTournaments[0].players.map(ignoreVariance);
    const spy = jest.fn((m, v, d, c) => null);
    const component = shallow(<TournamentParticipants id='mock0' notification={spy} />);
    const unHOC = component.dive().dive();
    expect(unHOC.find(IntegrationAutosuggest).prop('onSelect')).toEqual(unHOC.instance().handleSelect);
    let nextPlayer = {
      id: null,
      name: 'new player',
    };
    setTimeout(() => {
      unHOC.instance().handleSelect({
        id: nextPlayer.id,
        label: nextPlayer.name,
      }).then(() => {
        try {
          nextPlayer = testPlayers.map(ignoreVariance)[testPlayers.length - 1];
          players.push(nextPlayer);
          expect(testTournaments[0].players.map(ignoreVariance)).toEqual(players.sort(playerSort));
          expect(unHOC.state('participants')).toEqual(testTournaments[0].players);
          expect(spy.mock.calls[0][0]).toBe(`Created player ${nextPlayer.name}`);
          expect(spy.mock.calls[0][1]).toBe(`info`);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    }, 100);
  });
});
