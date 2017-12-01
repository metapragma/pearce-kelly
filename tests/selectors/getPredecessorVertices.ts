'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getPredecessorVertices } from '../../src/graph'

let state = store.getState()

// TODO: more thorough testing
describe('getPredecessorVertices()', () => {
  // run callback after each 'it' block
  afterEach(() => {
    removeNodes(store)
  })

  it('recursively discovers and returns all predecessor vertices of a given vertex in an array', () => {
    expect(getPredecessorVertices('v1')(state)).toEqual(
      [
        {
          name: 'v6',
          index: 6,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: ['v6']
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
          immediateSuccessorVertices: ['v9']
        }
      ]
    )
  })

  it(`returns an empty array if there is none`, () => {
    expect(getPredecessorVertices('v2')(state)).toEqual([])
  })
})

