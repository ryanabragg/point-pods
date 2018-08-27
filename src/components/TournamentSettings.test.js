import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';

import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import TextField from '@material-ui/core/TextField';

import TournamentSettings from './TournamentSettings';

import { testSettings, testTournaments } from '../testData';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TournamentSettings />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test('matches the prior snapshot', () => {
  const component = renderer.create(<TournamentSettings />);
  expect(component.toJSON()).toMatchSnapshot();
  component.update(<TournamentSettings title='test' {...testTournaments[0]} />);
  expect(component.toJSON()).toMatchSnapshot();
});

describe('props', () => {
  test('actions', () => {
    let component = shallow(<TournamentSettings />).dive();
    expect(component.find(CardActions).length).toBe(1);
    expect(component.find(CardActions).children().length).toBe(0);
    component = shallow(
      <TournamentSettings>
        <div>test</div>
        <div>trial</div>
      </TournamentSettings>
    ).dive();
    expect(component.find(CardActions).length).toBe(1);
    expect(component.find(CardActions).children().length).toBe(2);
    expect(component.find(CardActions).childAt(0).html()).toEqual('<div>test</div>');
    expect(component.find(CardActions).childAt(1).html()).toEqual('<div>trial</div>');
  });

  test('title', () => {
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find(CardHeader).length).toBe(0);
    component.setProps({ title: 'Test' });
    expect(component.find(CardHeader).length).toBe(1);
    expect(component.find(CardHeader).prop('title')).toBe('Test');
  });

  test('autoFocus', () => {
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find(TextField).at(0).prop('autoFocus')).toBe(false);
    component.setProps({ autoFocus: true });
    expect(component.find(TextField).at(0).prop('autoFocus')).toBe(true);
  });

  test('pairing methods', () => {
    let methods = [
      {label: 'new', value: 1},
      {label: 'test', value: 2},
    ];
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-pairingMethod').prop('options')).toEqual([]);
    expect(component.find('#tournament-pairingMethodInitial').prop('options')).toEqual([]);
    component.setProps({ pairingMethods: methods });
    expect(component.find('#tournament-pairingMethod').prop('options')).toEqual(methods);
    expect(component.find('#tournament-pairingMethodInitial').prop('options')).toEqual(methods);
  });

  test('categories', () => {
    let categories = ['old', 'new', 'test'];
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-category').prop('options')).toEqual([]);
    component.setProps({ categories: categories });
    component.update();
    expect(component.find('#tournament-category').prop('options')).toEqual(
      categories
        .sort((a, b) => {
          let left = a.toLowerCase();
          let right = b.toLowerCase();
          return left > right ? 1 : left < right ? -1 : 0;
        })
        .map(c => ({label: c, value: c}))
    );
  });

  test('name', () => {
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-name').prop('defaultValue')).toBe('');
    component.setProps({ name: 'test' });
    expect(component.find('#tournament-name').prop('defaultValue')).toBe('test');
  });

  test('description', () => {
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-description').prop('defaultValue')).toBe('');
    component.setProps({ description: 'test' });
    expect(component.find('#tournament-description').prop('defaultValue')).toBe('test');
  });

  test('category', () => {
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-category').prop('value')).toEqual('');
    component.setProps({ category: 'test' });
    expect(component.find('#tournament-category').prop('value')).toEqual('');
    component.setProps({ categories: ['test'] });
    expect(component.find('#tournament-category').prop('value')).toEqual({label: 'test', value: 'test'});
  });

  test('date', () => {
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-date').prop('defaultValue')).toBe('');
    component.setProps({ date: 'test' });
    expect(component.find('#tournament-date').prop('defaultValue')).toBe('test');
  });

  test('pairingMethod', () => {
    let methods = [
      {label: 'new', value: 1},
      {label: 'test', value: 2},
    ];
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-pairingMethod').prop('value')).toEqual(null);
    component.setProps({ pairingMethod: 1 });
    expect(component.find('#tournament-pairingMethod').prop('value')).toEqual(null);
    component.setProps({ pairingMethods: methods });
    expect(component.find('#tournament-pairingMethod').prop('value')).toEqual(methods.filter(m => m.value === 1)[0]);
  });

  test('pairingMethodInitial', () => {
    let methods = [
      {label: 'new', value: 1},
      {label: 'test', value: 2},
    ];
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-pairingMethodInitial').prop('value')).toEqual(null);
    component.setProps({ pairingMethodInitial: 1 });
    expect(component.find('#tournament-pairingMethodInitial').prop('value')).toEqual(null);
    component.setProps({ pairingMethods: methods });
    expect(component.find('#tournament-pairingMethodInitial').prop('value')).toEqual(methods.filter(m => m.value === 1)[0]);
  });

  test('podSizeMinimum', () => {
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-podSizeMinimum').prop('defaultValue')).toBe(0);
    component.setProps({ podSizeMinimum: 1 });
    expect(component.find('#tournament-podSizeMinimum').prop('defaultValue')).toBe(1);
  });

  test('podSizeMaximum', () => {
    const component = shallow(<TournamentSettings />).dive();
    expect(component.find('#tournament-podSizeMaximum').prop('defaultValue')).toBe(0);
    component.setProps({ podSizeMaximum: 1 });
    expect(component.find('#tournament-podSizeMaximum').prop('defaultValue')).toBe(1);
  });

  describe('onChange & immediate', () => {
    test('default', (done) => {
      const spy = jest.fn();
      const component = shallow(
        <TournamentSettings
          categories={['1', '2', '3']}
          pairingMethods={[
            {label: 'five', value: 5},
            {label: 'six', value: 6},
          ]}
          onChange={spy}
        />
      ).dive();
      component.find('#tournament-name').simulate('change', {target: {value: '1'}});
      component.find('#tournament-category').simulate('change', {value: '2'});
      component.find('#tournament-description').simulate('change', {target: {value: '3'}});
      component.find('#tournament-date').simulate('change', {target: {value: '4'}});
      component.find('#tournament-pairingMethod').simulate('change', {value: '5'});
      component.find('#tournament-pairingMethodInitial').simulate('change', {value: '6'});
      component.find('#tournament-podSizeMinimum').simulate('change', {target: {value: '7'}});
      component.find('#tournament-podSizeMaximum').simulate('change', {target: {value: '8'}});
      setTimeout(() => {
        try {
          expect(spy.mock.calls.length).toBe(1);
          expect(spy.mock.calls[0][0]).toEqual({
            name: '1',
            category: '2',
            description: '3',
            date: '4',
            pairingMethod: 5,
            pairingMethodInitial: 6,
            podSizeMinimum: 7,
            podSizeMaximum: 8,
          });
          done();
        } catch(error) {
          done.fail(error);
        }
      }, 2000);
    });

    test('with immediate', () => {
      const spy = jest.fn();
      const component = shallow(
        <TournamentSettings
          categories={['1', '2', '3']}
          pairingMethods={[
            {label: 'five', value: 5},
            {label: 'six', value: 6},
          ]}
          onChange={spy}
          immediate
        />
      ).dive();
      component.find('#tournament-name').simulate('change', {target: {value: '1'}});
      component.find('#tournament-category').simulate('change', {value: '2'});
      component.find('#tournament-description').simulate('change', {target: {value: '3'}});
      component.find('#tournament-date').simulate('change', {target: {value: '4'}});
      component.find('#tournament-pairingMethod').simulate('change', {value: '5'});
      component.find('#tournament-pairingMethodInitial').simulate('change', {value: '6'});
      component.find('#tournament-podSizeMinimum').simulate('change', {target: {value: '7'}});
      component.find('#tournament-podSizeMaximum').simulate('change', {target: {value: '8'}});
      expect(spy.mock.calls.length).toBe(8);
      expect(spy.mock.calls[0][0]).toBe('name');
      expect(spy.mock.calls[0][1]).toBe('1');
      expect(spy.mock.calls[1][0]).toBe('category');
      expect(spy.mock.calls[1][1]).toBe('2');
      expect(spy.mock.calls[2][0]).toBe('description');
      expect(spy.mock.calls[2][1]).toBe('3');
      expect(spy.mock.calls[3][0]).toBe('date');
      expect(spy.mock.calls[3][1]).toBe('4');
      expect(spy.mock.calls[4][0]).toBe('pairingMethod');
      expect(spy.mock.calls[4][1]).toBe(5);
      expect(spy.mock.calls[5][0]).toBe('pairingMethodInitial');
      expect(spy.mock.calls[5][1]).toBe(6);
      expect(spy.mock.calls[6][0]).toBe('podSizeMinimum');
      expect(spy.mock.calls[6][1]).toBe(7);
      expect(spy.mock.calls[7][0]).toBe('podSizeMaximum');
      expect(spy.mock.calls[7][1]).toBe(8);
    });

    test('creatable selects', (done) => {
      const spy = jest.fn();
      const component = shallow(
        <TournamentSettings
          categories={['new', 'test']}
          onChange={spy}
        />
      ).dive();
      component.instance().handleSelectCreateValue('category', 'createdCategories')('trial');
      expect(component.state('createdCategories')).toEqual(['trial']);
      setTimeout(() => {
        try {
          expect(spy.mock.calls.length).toBe(1);
          expect(spy.mock.calls[0][0]).toEqual({ category: 'trial' });
          done();
        } catch(error) {
          done.fail(error);
        }
      }, 2000);
    });
  });
});
