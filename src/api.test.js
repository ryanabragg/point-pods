import api from './api';

it('exports the correct values', () => {
  expect(api).toBeInstanceOf(Object);
  expect(api.hasOwnProperty('store')).toBe(true);
});
