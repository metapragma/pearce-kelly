'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getVertexValues } from '../../src/graph'

describe('getVertexValues()', () => {
  // run callback after each 'it' block
  afterEach(() => {
    removeNodes(store)
  })

  it('looks up and returns an array of existing vertex values', () => {
    expect(getVertexValues(store.getState())).toEqual(
      [
        {
          name: 'v1', 
          index: 1,
          visited: false,
          immediatePredecessorVertices: ['v2', 'v3', 'v4', 'v5'],
          immediateSuccessorVertices: ['v6', 'v7', 'v8', 'v9']
        },
        {
          name: 'v2',
          index: 2,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: ['v6']
        },
        {
          name: 'v3',
          index: 3,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: []
        },
        {
          name: 'v4',
          index: 4,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: []
        },
        {
          name: 'v5',
          index: 5,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: ['v9']
        },
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
  })
  
  it(`looks up and returns an empty array when graph doesn't contain nodes`, () => {
    expect(getVertexValues(store.getState())).toEqual([])
  })    
})

