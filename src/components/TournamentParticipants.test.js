import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';

import TournamentParticipants from './TournamentParticipants';
import Select from './Select';

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
  ReactDOM.render(<TournamentParticipants />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const component = renderer.create(<TournamentParticipants />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(
    <TournamentParticipants
      players={testTournaments[0].players}
      allPlayers={testPlayers}
    />
  );
  expect(component.toJSON()).toMatchSnapshot();
  component.update(
    <TournamentParticipants
      players={testTournaments[0].players}
      allPlayers={testPlayers}
      sort={playerSort}
    />
  );
  expect(component.toJSON()).toMatchSnapshot();
});

describe('actions', () => {
  test('adding a player', () => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentParticipants
        players={testTournaments[0].players}
        allPlayers={testPlayers}
        handleSelectPlayer={spy}
      />
    );
    const component = HOC.dive();
    expect(component.find(Select).prop('onChange')).toEqual(component.instance().handleSelect);
    component.instance().handleSelect(testPlayers[8], 'test');
    expect(spy.mock.calls[0][0]).toBe(testPlayers[8]);
    expect(spy.mock.calls[0][1]).toBe('test');
  });

  test('adding a new player', () => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentParticipants
        players={testTournaments[0].players}
        allPlayers={testPlayers}
        handleSelectCreatePlayer={spy}
      />
    );
    const component = HOC.dive();
    expect(component.find(Select).prop('onCreateOption')).toEqual(component.instance().handleCreate);
    component.instance().handleCreate('testing');
    expect(spy.mock.calls[0][0]).toBe('testing');
  });

  test('removing a player (non-participating)', () => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentParticipants
        players={testTournaments[0].players}
        allPlayers={testPlayers}
        handleRemovePlayer={spy}
      />
    );
    const component = HOC.dive();
    component.find(ListItem).at(3).find(IconButton).simulate('click');
    expect(spy.mock.calls[0][0]).toBe(testTournaments[0].players[3].id);
  });

  test('removing a player (drop participant)', () => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentParticipants
        players={testTournaments[0].players}
        allPlayers={testPlayers}
        handleRemovePlayer={spy}
      />
    );
    const component = HOC.dive();
    component.find(ListItem).at(2).find(IconButton).simulate('click');
    expect(spy.mock.calls[0][0]).toBe(testTournaments[0].players[2].id);
  });

  test('reinstating a player (un-drop)', () => {
    const spy = jest.fn();
    const HOC = shallow(
      <TournamentParticipants
        players={testTournaments[0].players}
        allPlayers={testPlayers}
        handleUnDropPlayer={spy}
      />
    );
    const component = HOC.dive();
    component.find(ListItem).at(0).find(IconButton).simulate('click');
    expect(spy.mock.calls[0][0]).toBe(testTournaments[0].players[0].id);
  });
});
