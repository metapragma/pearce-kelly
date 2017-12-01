'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { isVertexImmediateSuccessorVertex } from '../../src/graph'

describe('isVertexImmediateSuccessorVertex()', () => {
  it('returns true if vertex is immediate successor to given vertex', () => {
    expect(isVertexImmediateSuccessorVertex('v1', 'v6')(store.getState())).toBe(true)
    expect(isVertexImmediateSuccessorVertex('v1', 'v7')(store.getState())).toBe(true)
  })

  it(`returns false if vertex is not immediate successor to given vertex`, () => {
    expect(isVertexImmediateSuccessorVertex('v4', 'v9')(store.getState())).toBe(false)
    expect(isVertexImmediateSuccessorVertex('v2', 'v1')(store.getState())).toBe(false)
  })
})