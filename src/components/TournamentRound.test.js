import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';

import TournamentRound from './TournamentRound';
import MenuButton from './MenuButton';

import { testPlayers, testTournaments } from '../testData';

const playerSort = jest.fn((a, b) => {
  if(a.name < b.name)
    return -1;
  else if(a.name > b.name)
    return 1;
  return 0;
});

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TournamentRound />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const component = renderer.create(<TournamentRound />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(
    <TournamentRound
      players={testTournaments[0].players}
    />
  );
  expect(component.toJSON()).toMatchSnapshot();
  component.update(
    <TournamentRound
      players={testTournaments[0].players}
      playerSort={playerSort}
      rounds={testTournaments[0].rounds}
      activeRound={testTournaments[0].activeRound}
    />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

describe('actions', () => {
  test('scoring', (done) => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentRound
        players={testTournaments[1].players}
        playerSort={playerSort}
        rounds={testTournaments[1].rounds}
        activeRound={2}
        onUpdateScores={spy}
      />
    );
    const component = HOC.dive();
    component.find('#mock3').find(TextField).simulate('change', {target: {value: '42'}});
    setTimeout(() => {
      component.update();
      try {
        expect(spy.mock.calls[0][0]).toEqual([{id: 'mock3', points: 42}]);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 3000);
  });

  test('drop a player', () => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentRound
        players={testTournaments[1].players}
        playerSort={playerSort}
        rounds={testTournaments[1].rounds}
        activeRound={2}
        onRemovePlayer={spy}
      />
    );
    const component = HOC.dive();
    component.find('#mock4').find(IconButton).simulate('click');
    expect(spy.mock.calls[0][0]).toBe('mock4');
  });

  test('reinstate a player', () => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentRound
        players={testTournaments[1].players}
        playerSort={playerSort}
        rounds={testTournaments[1].rounds}
        activeRound={2}
        onReinstatePlayer={spy}
      />
    );
    const component = HOC.dive();
    component.find('#mock1').find(IconButton).simulate('click');
    expect(spy.mock.calls[0][0]).toBe('mock1');
  });

  test('moving a player to a pod', () => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentRound
        players={testTournaments[1].players}
        playerSort={playerSort}
        rounds={testTournaments[1].rounds}
        activeRound={2}
        onSetPlayerPod={spy}
      />
    );
    const component = HOC.dive();
    expect(component.find(Card).length).toBe(4);
    expect(component.find(ListItem).length).toBe(testTournaments[1].players.length);
    component.find(Card).forEach((node, i) => {
      let players = {
        0: 1,
        1: 2,
        2: 4,
        3: 1,
      };
      expect(node.find(ListItem).length).toBe(players[i]);
      let menuItems = node.find(MenuButton).at(0).prop('menuItems');
      if(i == 1) {
        expect(menuItems.length).toBe(2);
        expect(menuItems[0].label).toBe('Move to Pod 2 (4 players)');
        expect(menuItems[1].label).toBe('Move to new pod (Pod 3)');
      }
      else if(i == 2) {
        expect(menuItems.length).toBe(2);
        expect(menuItems[0].label).toBe('Move to Pod 1 (2 players)');
        expect(menuItems[1].label).toBe('Move to new pod (Pod 3)');
      }
      else {
        expect(menuItems.length).toBe(3);
        expect(menuItems[0].label).toBe('Move to Pod 1 (2 players)');
        expect(menuItems[1].label).toBe('Move to Pod 2 (4 players)');
        expect(menuItems[2].label).toBe('Move to new pod (Pod 3)');
      }
    });
    component.setProps({ activeRound: 1 });
    expect(component.find(Card).length).toBe(3);
    expect(component.find(ListItem).length).toBe(testTournaments[1].players.length);
    component.find(Card).forEach((node, i) => {
      let players = {
        0: 2,
        1: 3,
        2: 3,
        3: 0,
      };
      expect(node.find(ListItem).length).toBe(players[i]);
      expect(node.find(MenuButton).length).toBe(0);
      expect(node.find(IconButton).length).toBe(0);
    });
  });
});
