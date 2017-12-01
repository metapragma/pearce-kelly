'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { isVisited, setVertexVisited } from '../../src/graph'

import { IState } from '../../types'
import { Store } from 'redux'

const changeVisited = (store: Store<IState>) => {
  let state = store.getState()
  for (const vertex in state.vertexMap) {
    store.dispatch(setVertexVisited(vertex, true))
  }
}

describe('isVisited()', () => {
  afterEach(() => {
    changeVisited(store)
  })

  it('returns true if vertex is visited', () => {
    expect(isVisited('v1')(store.getState())).toBe(false)
    expect(isVisited('v3')(store.getState())).toBe(false)
    expect(isVisited('v7')(store.getState())).toBe(false)
  })

  it('returns false if vertex is not visited', () => {
    expect(isVisited('v1')(store.getState())).toBe(true)
    expect(isVisited('v3')(store.getState())).toBe(true)
    expect(isVisited('v7')(store.getState())).toBe(true)
  })
})
