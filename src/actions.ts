import {
  IState,
  IVertexState,
  ISetVertexByVertexName,
  IUnsetVertexByVertexName,
  ISetVertexName,
  ISetVertexIndex,
  ISetVertexVisited,
  IRemoveImmediatePredecessorVertex,
  IAddImmediatePredecessorVertex,
  IRemoveImmediateSuccessorVertex,
  IAddImmediateSuccessorVertex,
  IResetVisited,
  IRemoveAllImmediatePredecessorVertices,
  IRemoveAllImmediateSuccessorVertices,
  IAppendVertexToState
} from './types'

import {
  isVertexPresentByVertexName,
  isEdgePresentByVertexNames
} from './selectors'

import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

export const setVertexByVertexName = (vertexName: string, vertex: IVertexState): ISetVertexByVertexName => ({
  type: 'SET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName,
    vertex
  }
})

export const unsetVertexByVertexName = (vertexName: string) => ({
  type: 'UNSET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName
  }
})

export const setVertexName = (currentName: string, newName: string): ISetVertexName => ({
  type: 'SET_VERTEX_NAME',
  payload: {
    currentName,
    newName
  }
})

export const setVertexIndex = (vertexName: string, index: number): ISetVertexIndex => ({
  type: 'SET_VERTEX_INDEX',
  payload: {
    vertexName,
    index
  }
})

export const setVertexVisited = (vertexName: string, visited: boolean): ISetVertexVisited => ({
  type: 'SET_VERTEX_VISITED',
  payload: {
    vertexName,
    visited
  }
})

export const removeImmediatePredecessorVertex = (vertexName: string, vertexToRemove: string): IRemoveImmediatePredecessorVertex => ({
  type: 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName,
    vertexToRemove
  }
})

export const removeImmediateSuccessorVertex = (vertexName: string, vertexToRemove: string): IRemoveImmediateSuccessorVertex => ({
  type: 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName,
    vertexToRemove
  }
})

export const addImmediatePredecessorVertex = (vertexName: string, vertexToAdd: string): IAddImmediatePredecessorVertex => ({
  type: 'ADD_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName,
    vertexToAdd
  }
})

export const addImmediateSuccessorVertex = (vertexName: string, vertexToAdd: string): IAddImmediateSuccessorVertex => ({
  type: 'ADD_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName,
    vertexToAdd
  }
})

export const resetVisited = (vertexName: string): IResetVisited => ({
  type: 'RESET_VISITED',
  payload: {
    vertexName
  }
})

export const removeAllImmediatePredecessorVertices = (vertexName: string): IRemoveAllImmediatePredecessorVertices => ({
  type: 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES',
  payload: {
    vertexName
  }
})

export const removeAllImmediateSuccessorVertices = (vertexName: string): IRemoveAllImmediateSuccessorVertices => ({
  type: 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES',
  payload: {
    vertexName
  }
})

export const appendVertexToState = (vertex: IVertexState): IAppendVertexToState => ({
  type: 'APPEND_VERTEX_TO_STATE',
  payload: {
    vertex
  }
})

export const removeEdgeByVertexNames = (sourceVertexName: string, targetVertexName: string):
  ThunkAction<void, IState, never> => (dispatch, getState) => {
    const state = getState()
    const edgePresent = isEdgePresentByVertexNames(sourceVertexName, targetVertexName)(state)

    if (edgePresent) {
      dispatch(removeImmediateSuccessorVertex(sourceVertexName, targetVertexName))
      dispatch(removeImmediatePredecessorVertex(targetVertexName, sourceVertexName))
    }
  }

export const removeVertexByVertexName = (vertexName: string):
  ThunkAction<void, IState, never> => (dispatch, getState) => {
    const state = getState()
    const vertexPresent = isVertexPresentByVertexName(vertexName)(state)

    if (vertexPresent) {
      dispatch(removeIncomingEdges(vertexName))
      dispatch(removeOutgoingEdges(vertexName))
      dispatch(unsetVertexByVertexName(vertexName))
    }
  }

export const removeEdgesBySourceVertexName = (sourceVertexName: string):
  ThunkAction<void, IState, never> => (dispatch, getState) => {
    const state = getState()
    const sourceVertexPresent = isVertexPresentByVertexName(sourceVertexName)(state)

    if (sourceVertexPresent) {
      dispatch(removeOutgoingEdges(sourceVertexName))
    }
  }

export const removeEdgesByTargetVertexName = (targetVertexName: string):
  ThunkAction<void, IState, never> => (dispatch, getState) => {
    const state = getState()
    const sourceVertexPresent = isVertexPresentByVertexName(targetVertexName)(state)

    if (sourceVertexPresent) {
      dispatch(removeIncomingEdges(targetVertexName))
    }
  }

export const removeIncomingEdges = (vertexName: string):
  ThunkAction<void, IState, never> => (dispatch, getState) => {
    const state = getState()

    state.vertexMap[vertexName].immediatePredecessorVertices.forEach((vertex) => {
      dispatch(removeImmediateSuccessorVertex(vertexName, vertex))
    })

    dispatch(removeAllImmediatePredecessorVertices(vertexName))
  }

export const removeOutgoingEdges = (vertexName: string):
  ThunkAction<void, IState, never> => (dispatch, getState) => {
    const state = getState()

    state.vertexMap[vertexName].immediateSuccessorVertices.forEach((vertex) => {
      dispatch(removeImmediatePredecessorVertex(vertexName, vertex))
    })

    dispatch(removeAllImmediateSuccessorVertices(vertexName))
  }

export const createVertex = (name: string, index: number, visited: boolean, immediatePredecessorVertices: string[], immediateSuccessorVertices: string[]):
  ThunkAction<void, IState, never> => (dispatch) => {
    const vertex = {
      name: name,
      index: index,
      visited: visited,
      immediatePredecessorVertices: immediatePredecessorVertices,
      immediateSuccessorVertices: immediateSuccessorVertices
    }

    dispatch(appendVertexToState(vertex))
  }
