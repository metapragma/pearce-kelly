'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getIndex } from '../../src/graph'

describe('getIndex()', () => {
  afterEach(() => {
    removeNodes(store)
  })

  it('returns the index of provided vertex', () => {
    expect(getIndex('v1')(store.getState())).toEqual(1)
    expect(getIndex('v3')(store.getState())).toEqual(3)
    expect(getIndex('v7')(store.getState())).toEqual(7)
  })
})
