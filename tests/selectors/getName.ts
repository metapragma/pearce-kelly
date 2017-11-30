'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getName } from '../../src/graph'

describe('getName()', () => {
  afterEach(() => {
    removeNodes(store)
  })

  it('returns the name of provided vertex', () => {
    expect(getName('v1')(store.getState())).toEqual('v1')
    expect(getName('v3')(store.getState())).toEqual('v3')
    expect(getName('v7')(store.getState())).toEqual('v7')
  })
})
