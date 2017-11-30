'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getVertexNames } from '../../src/graph'

describe('getVertexNames()', () => {
  afterEach(() => {
    removeNodes(store)
  })

  it('looks up and returns an array of existing vertex names', () => {
    expect(getVertexNames(store.getState())).toEqual(['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9'])
  })

  it(`looks up and returns an empty array when graph doesn't contain nodes`, () => {
    expect(getVertexNames(store.getState())).toEqual([])
  })
})