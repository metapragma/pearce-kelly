'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { createStore, applyMiddleware } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk'

import {
  reducer,
  createVertex,
  appendVertexToState,
  getName,
  getIndex,
  isVisited,
  addImmediatePredecessorVertex,
  addImmediateSuccessorVertex,
  getImmediatePredecessorVertices,
  getImmediateSuccessorVertices,
  getPredecessorVertexNames,
  getSuccessorVertexNames,
  getPredecessorVertices,
  getSuccessorVertices,
  isVertexImmediatePredecessorVertex,
  isVertexImmediateSuccessorVertex,
  setVertexName,
  setVertexIndex,
  setVisited,
  removeImmediatePredecessorVertex,
  removeImmediateSuccessorVertex,
  resetVisited,
  getVertexValues,
  getVertexNames
} from '../graph'

import {
  remove,
  omit
} from 'lodash'

describe("graph", () => {
  it("creates a new vertex and appends it to global state", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))

    expect(store.getState()).toEqual({
      vertexMap: {
        v1: {
          name: 'v1',
          index: 1,
          visited: false,
          immediatePredecessorVertices: [],
          immediateSuccessorVertices: [],
        }
      }
    })
  })

  it("gets the name of a vertex", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    const state = store.getState()
    expect(getName('v1')(state)).toEqual('v1')
  })

  it("gets the index of a vertex", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    const state = store.getState()
    expect(getIndex('v1')(state)).toEqual(1)
  })

  it("checks whether vertex is visited", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    const state = store.getState()
    expect(isVisited('v1')(state)).toBe(false)
  })

  it("adds immediate predecessor vertex", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediatePredecessorVertex('v1', 'v2'))
    store.dispatch(addImmediatePredecessorVertex('v1', 'v3'))
    const state = store.getState()
    expect(getImmediatePredecessorVertices('v1')(state)).toEqual(['v2', 'v3'])
  })

  it("adds immediate successor vertex", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediateSuccessorVertex('v1', 'v2'))
    store.dispatch(addImmediateSuccessorVertex('v1', 'v3'))
    const state = store.getState()
    expect(getImmediateSuccessorVertices('v1')(state)).toEqual(['v2', 'v3'])
  })

  // TODO: test with a nontrivial graph

  it("gets immediate successor vertices", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediateSuccessorVertex('v1', 'v2'))
    store.dispatch(addImmediateSuccessorVertex('v1', 'v3'))
    const state = store.getState()
    expect(getImmediateSuccessorVertices('v1')(state)).toEqual(['v2', 'v3'])
  })

  it("gets immediate predecessor vertices", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediatePredecessorVertex('v1', 'v2'))
    store.dispatch(addImmediatePredecessorVertex('v1', 'v3'))
    const state = store.getState()
    expect(getImmediatePredecessorVertices('v1')(state)).toEqual(['v2', 'v3'])
  })

  it("gets all predecessor vertex names", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediatePredecessorVertex('v1', 'v2'))
    store.dispatch(addImmediatePredecessorVertex('v2', 'v3'))
    const state = store.getState()
    expect(getPredecessorVertexNames('v1')(state)).toEqual(['v2', 'v3'])
  })

  it("gets all successor vertex names", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediateSuccessorVertex('v1', 'v2'))
    store.dispatch(addImmediateSuccessorVertex('v2', 'v3'))
    const state = store.getState()
    expect(getSuccessorVertexNames('v1')(state)).toEqual(['v2', 'v3'])
  })

  it("gets all predecessor vertices", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediatePredecessorVertex('v1', 'v2'))
    store.dispatch(addImmediatePredecessorVertex('v2', 'v3'))
    const state = store.getState()
    expect(getPredecessorVertices('v1')(state)).toEqual([
      {
        name: 'v2',
        index: 2,
        visited: false,
        immediatePredecessorVertices: ['v3'],
        immediateSuccessorVertices: []
      },
      {
        name: 'v3',
        index: 3,
        visited: false,
        immediatePredecessorVertices: [],
        immediateSuccessorVertices: []
      }
    ])
  })

  it("gets all successor vertices", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediateSuccessorVertex('v1', 'v2'))
    store.dispatch(addImmediateSuccessorVertex('v2', 'v3'))
    const state = store.getState()
    expect(getSuccessorVertices('v1')(state)).toEqual([
      {
        name: 'v2',
        index: 2,
        visited: false,
        immediatePredecessorVertices: [],
        immediateSuccessorVertices: ['v3']
      },
      {
        name: 'v3',
        index: 3,
        visited: false,
        immediatePredecessorVertices: [],
        immediateSuccessorVertices: []
      }
    ])
  })

  it("checks whether vertex is immediate predecessor", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediatePredecessorVertex('v1', 'v2'))
    const state = store.getState()
    expect(isVertexImmediatePredecessorVertex('v1', 'v2')(state)).toBe(true)
    expect(isVertexImmediatePredecessorVertex('v1', 'v3')(state)).toBe(false)
  })

  it("checks whether vertex is immediate successor", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    store.dispatch(createVertex('v3', 3, false, [], []))
    store.dispatch(addImmediateSuccessorVertex('v1', 'v2'))
    const state = store.getState()
    expect(isVertexImmediateSuccessorVertex('v1', 'v2')(state)).toBe(true)
    expect(isVertexImmediateSuccessorVertex('v1', 'v3')(state)).toBe(false)
  })

  it("sets vertex name", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(setVertexName('v1', 'v2'))
    const state = store.getState()
    expect(state.vertexMap['v2']).toEqual({
      name: 'v1',
      index: 1,
      visited: false,
      immediatePredecessorVertices: [],
      immediateSuccessorVertices: []
    })
    expect(state.vertexMap['v1']).toBe(undefined)
  })

  it("sets vertex name", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(setVertexIndex('v1', 2))
    const state = store.getState()
    expect(state.vertexMap['v1'].index).toEqual(2)
  })

  it("sets vertex' visited value", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(setVisited('v1', true))
    const state = store.getState()
    expect(state.vertexMap['v1'].visited).toBe(true)
  })

  // TODO: check remoe methods

  // it("removes immediate predecessor vertex", () => {
  //   let store = createStore(reducer, applyMiddleware(thunk))
  //   store.dispatch(createVertex('v1', 1, false, [], []))
  //   store.dispatch(createVertex('v2', 2, false, [], []))
  //   store.dispatch(createVertex('v3', 3, false, [], []))
  //   store.dispatch(createVertex('v4', 4, false, [], []))
  //   store.dispatch(createVertex('v5', 5, false, [], []))
  //   store.dispatch(addImmediatePredecessorVertex('v1', 'v2'))
  //   store.dispatch(addImmediatePredecessorVertex('v1', 'v3'))
  //   store.dispatch(addImmediatePredecessorVertex('v1', 'v4'))
  //   store.dispatch(addImmediatePredecessorVertex('v1', 'v5'))
  //   const state = store.getState()
  //   expect(getPredecessorVertexNames('v1')(state)).toEqual(['v2', 'v3', 'v4', 'v5'])
  //   store.dispatch(removeImmediatePredecessorVertex('v1', 'v2'))
  //   store.dispatch(removeImmediatePredecessorVertex('v1', 'v3'))
  //   store.dispatch(removeImmediatePredecessorVertex('v1', 'v4'))
  //   store.dispatch(removeImmediatePredecessorVertex('v1', 'v5'))
  //   expect(getPredecessorVertexNames('v1')(state)).toEqual([])
  // })

  // it("removes immediate predecessor vertex", () => {
  //   let store = createStore(reducer, applyMiddleware(thunk))
  //   store.dispatch(createVertex('v1', 1, false, [], []))
  //   store.dispatch(createVertex('v2', 2, false, [], []))
  //   store.dispatch(createVertex('v3', 3, false, [], []))
  //   store.dispatch(createVertex('v4', 4, false, [], []))
  //   store.dispatch(createVertex('v5', 5, false, [], []))
  //   store.dispatch(addImmediateSuccessorVertex('v1', 'v2'))
  //   store.dispatch(addImmediateSuccessorVertex('v1', 'v3'))
  //   store.dispatch(addImmediateSuccessorVertex('v1', 'v4'))
  //   store.dispatch(addImmediateSuccessorVertex('v1', 'v5'))
  //   const state = store.getState()
  //   expect(getSuccessorVertexNames('v1')(state)).toEqual(['v2', 'v3', 'v4', 'v5'])
  //   store.dispatch(removeImmediateSuccessorVertex('v1', 'v2'))
  //   store.dispatch(removeImmediateSuccessorVertex('v1', 'v3'))
  //   store.dispatch(removeImmediateSuccessorVertex('v1', 'v4'))
  //   store.dispatch(removeImmediateSuccessorVertex('v1', 'v5'))
  //   expect(getSuccessorVertexNames('v1')(state)).toEqual([])
  // })

  // it("resets vertex visited to false", () => {
  //   let store = createStore(reducer, applyMiddleware(thunk))
  //   store.dispatch(createVertex('v1', 1, true, [], []))
  //   const state = store.getState()
  //   expect(state.vertexMap['v1'].visited).toBe(true)
  //   store.dispatch(resetVisited('v1'))
  //   expect(state.vertexMap['v1'].visited).toBe(false)
  // })

  it("gets vertex values", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    const state = store.getState()
    expect(getVertexValues(state)).toEqual([
      {
        name: 'v1',
        index: 1,
        visited: false,
        immediatePredecessorVertices: [],
        immediateSuccessorVertices: []
      },
      {
        name: 'v2',
        index: 2,
        visited: false,
        immediatePredecessorVertices: [],
        immediateSuccessorVertices: []
      }
    ])
  })

  it("gets vertex values", () => {
    let store = createStore(reducer, applyMiddleware(thunk))
    store.dispatch(createVertex('v1', 1, false, [], []))
    store.dispatch(createVertex('v2', 2, false, [], []))
    const state = store.getState()
    expect(getVertexNames(state)).toEqual(['v1', 'v2'])
  })
})
