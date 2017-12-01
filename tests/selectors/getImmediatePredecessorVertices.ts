'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getImmediatePredecessorVertices} from '../../src/graph'

describe('getImmediatePredecessorVertices()', () => {
  it('returns the names of immediate predecessor vertices of a given vertex', () => {
    expect(getImmediatePredecessorVertices('v1')(store.getState())).toEqual(['v2', 'v3', 'v4', 'v5'])
  })

  it(`returns an empty array if vertex doesn't have immediate predecessors`, () => {
    expect(getImmediatePredecessorVertices('v2')(store.getState())).toEqual([])
  })
})