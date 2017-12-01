'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { isVertexImmediatePredecessorVertex } from '../../src/graph'

describe('isVertexImmediatePredecessorVertex()', () => {
  it('returns true if vertex is immediate predecessor to given vertex', () => {
    expect(isVertexImmediatePredecessorVertex('v1', 'v2')(store.getState())).toBe(true)
    expect(isVertexImmediatePredecessorVertex('v1', 'v3')(store.getState())).toBe(true)
  })

  it(`returns false if vertex is not immediate predecessor to given vertex`, () => {
    expect(isVertexImmediatePredecessorVertex('v4', 'v9')(store.getState())).toBe(false)
    expect(isVertexImmediatePredecessorVertex('v2', 'v1')(store.getState())).toBe(false)
  })
})