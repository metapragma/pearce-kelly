'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { isVertexPresentByVertexName } from '../../src/graph'

describe('isVertexPresentByVertexName()', () => {
  afterEach(() => {
    removeNodes(store)
  })

  it(`returns vertex value if it's present in the graph`, () => {
    expect(isVertexPresentByVertexName('v1')(store.getState())).toBe(true)
    expect(isVertexPresentByVertexName('v7')(store.getState())).toBe(true)
  })

  it(`returns null if such vertex doesn't exist`, () => {
    expect(isVertexPresentByVertexName('v5')(store.getState())).toBe(false)
    expect(isVertexPresentByVertexName('v1')(store.getState())).toBe(false)
  })
})
