'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { isEmpty } from '../../src/graph'

describe('isEmpty', () => {
  afterEach(() => {
    removeNodes(store)
  })

  it('returns false if graph is not empty', () => {
    expect(isEmpty(store.getState())).toBe(false)
  })

  it('returns true if graph is empty', () => {
    expect(isEmpty(store.getState())).toBe(true)
  })
})
