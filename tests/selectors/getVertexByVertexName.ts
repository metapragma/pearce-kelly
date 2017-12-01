'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getVertexByVertexName } from '../../src/graph'

describe('getVertexByVertexName()', () => {
  afterEach(() => {
    removeNodes(store)
  })

  it(`returns vertex value if it's present in the graph`, () => {
    expect(getVertexByVertexName('v1')(store.getState())).toEqual(
      {
        name: 'v1',
        index: 1,
        visited: false,
        immediatePredecessorVertices: ['v2', 'v3', 'v4', 'v5'],
        immediateSuccessorVertices: ['v6', 'v7', 'v8', 'v9']
      }
    )
    expect(getVertexByVertexName('v4')(store.getState())).toEqual(
      {
        name: 'v4',
        index: 4,
        visited: false,
        immediatePredecessorVertices: [],
        immediateSuccessorVertices: []
      }
    )
  })

  it(`returns null if such vertex doesn't exist`, () => {
    expect(getVertexByVertexName('v1')(store.getState())).toBe(null)
  })
})
