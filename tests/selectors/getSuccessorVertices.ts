'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getSuccessorVertices } from '../../src/graph'

let state = store.getState()

// TODO: more thorough testing
describe('getSuccessorVertices()', () => {
  // run callback after each 'it' block
  afterEach(() => {
    removeNodes(store)
  })

  it('recursively discovers and returns all successor vertices of a given vertex in an array', () => {
    expect(getSuccessorVertices('v1')(state)).toEqual(
      [
        {
          name: 'v6',
          index: 6,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: []
        },
        {
          name: 'v7',
          index: 7,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: []
        },
        {
          name: 'v8',
          index: 8,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: []
        },
        {
          name: 'v9',
          index: 9,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: []
        }
      ]
    )

    expect(getSuccessorVertices('v2')(state)).toEqual(
      [
        {
          name: 'v6',
          index: 6,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: []
        }
      ]
    )
  })

  it(`looks up and returns an empty array when graph doesn't contain nodes`, () => {
    expect(getSuccessorVertices('v4')(state)).toEqual([])
  })
})

