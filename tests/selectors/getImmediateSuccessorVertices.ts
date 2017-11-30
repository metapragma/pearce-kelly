'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getImmediateSuccessorVertices } from '../../src/graph'

describe('getImmediateSuccessorVertices()', () => {
  it('returns the names of immediate successor vertices of a given vertex', () => {
    expect(getImmediateSuccessorVertices('v1')(store.getState())).toEqual(['v6', 'v7', 'v8', 'v9'])
    expect(getImmediateSuccessorVertices('v2')(store.getState())).toEqual(['v6'])
  })

  it(`returns an empty array if vertex doesn't have immediate successors`, () => {
    expect(getImmediateSuccessorVertices('v4')(store.getState())).toEqual([])
  })
})