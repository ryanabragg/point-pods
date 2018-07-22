import api, { APIContext, withAPI } from './api';
import React, { Component } from 'react';

it('exports the expected values', () => {
  expect(api).toBeInstanceOf(Object);
  expect(APIContext).toBeInstanceOf(Object);
  expect(withAPI).toBeInstanceOf(Function);
});

describe('api values', () => {
  it('has localforage as store', () => {
    expect(api.hasOwnProperty('store')).toBe(true);
    expect(api.store._defaultConfig.name).toBe('localforage');
  });
});