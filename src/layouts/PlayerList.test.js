import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Dialog from '@material-ui/core/Dialog';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import PlayerList from './PlayerList';

import api from '../api';

import { testPlayers, mockStorage, mockAPI, demockAPI } from '../testData';

beforeEach(() => mockAPI(api, mockStorage));
afterEach(() => demockAPI(api));

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<PlayerList />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', (done) => {
  const component = renderer.create(<PlayerList />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<PlayerList />);
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
  const wrapper = shallow(<PlayerList />);
  expect(wrapper.type().prototype.constructor.name).toBe('APIComponent');
  expect(wrapper.dive().type().prototype.constructor.name).toBe('PlayerList');
});

describe('defaults', () => {
  test('values', () => {
    const wrapper = shallow(<PlayerList />);
    const component = wrapper.dive().dive();
    expect(component.state('dialog')).toBe(null);
    expect(component.state('searching')).toBe(false);
    expect(component.state('sort')).toEqual({field: 'name', ascending: true});
    expect(component.state('selected')).toEqual([]);
  });

  test('loads the state', (done) => {
    const wrapper = shallow(<PlayerList />);
    const component = wrapper.dive().dive();
    expect(component.state('players')).toEqual([]);
    setTimeout(() => {
      try {
        expect(component.state('players')).toEqual(testPlayers);
        done();
      } catch (error) {
        done.fail(error);
      }
    }, 100);
  });
});

describe('actions', () => {
  test('select');

  test('searching');

  test('sorting');

  test('add a player', (done) => {
    const spy = jest.fn((m, v, d, c) => null);
    const wrapper = shallow(<PlayerList notification={spy} />);
    const component = wrapper.dive().dive();
    expect(component.find(Dialog).length).toBe(0);
    expect(component.state('dialog')).toBe(null);
    setTimeout(() => {
      try {
        component.findWhere(node => node.prop('variant') === 'fab').simulate('click');
        expect(component.state('dialog')).toBe('new-player');
        expect(component.find(Dialog).length).toBe(1);
        component.find('#new-player-cancel').simulate('click');
        expect(component.find(Dialog).length).toBe(0);
        expect(component.state('dialog')).toBe(null);
        component.findWhere(node => node.prop('variant') === 'fab').simulate('click');
        const newName = 'Add Test';
        component.find('#new-player-name').simulate('change', {target: {value: newName}});
        component.find('#new-player-submit').simulate('click');
        setTimeout(() => {
          try {
            const last = component.state('players').length - 1;
            expect(component.state('players')[last].name).toBe(newName);
            expect(spy.mock.calls[0][0]).toBe(`Created player ${newName}`);
            expect(spy.mock.calls[0][1]).toBe(`info`);
            done();
          } catch(error) {
            done.fail(error);
          }
        }, 100);
      } catch(error) {
        done.fail(error);
      }
    }, 100);
  });
});
