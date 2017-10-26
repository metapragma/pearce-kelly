import { Vertex, IVertexMap } from './vertex'
import Edge from './edge'

import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'

import {
  remove,
  omit
} from 'lodash'

export type Selector<S, R> = (state: S) => R

export interface IState {
  vertexMap: {
    [key: string]: IVertexState
  }
}

export const getVertexValues: Selector<IState, IVertexState[]> = state =>
  Object.keys(state.vertexMap).map(key => state.vertexMap[key])

export const getVertexNames: Selector<IState, string[]> = state => Object.keys(state.vertexMap)

export const isEmpty: Selector<IState, boolean> = state => getVertexValues(state).length === 0

export const isVertexPresentByVertexName = (vertexName: string): Selector<IState, boolean> =>
  state => getVertexNames(state).includes(vertexName)

export const getVertexByVertexName = (vertexName: string): Selector<IState, IVertexState | null> =>
  state => {
    if (isVertexPresentByVertexName(vertexName)(state) === true) {
      return state.vertexMap[vertexName]
    } else {
      return null
    }
  }

// TODO review
export const isEdgePresentByVertexNames = (sourceVertexName: string, targetVertexName: string):
  Selector<IState, boolean> =>
  state => {
    let edgePresent = false

    const sourceVertex = getVertexByVertexName(sourceVertexName)(state)
    const targetVertex = getVertexByVertexName(targetVertexName)(state)
    const sourceVertexAndTargetVertexPresent =
      getVertexByVertexName(sourceVertexName)(state) !== null &&
      getVertexByVertexName(targetVertexName)(state) !== null

    if (sourceVertexAndTargetVertexPresent) {
      edgePresent =
        isVertexImmediateSuccessorVertex(sourceVertexName, targetVertexName)(state) &&
        isVertexImmediatePredecessorVertex(targetVertexName, sourceVertexName)(state)
    }

    return edgePresent
  }

export const isEdgePresent = (edge: Edge): Selector<IState, boolean> => state =>
  isEdgePresentByVertexNames(edge.getSourceVertexName(), edge.getTargetVertexName())(state)

// export const getPredecessorVertexNamesByVertexName = (vertexName: string): Selector<IState, string[]> =>
//   state => getPredecessorVertexNames(vertexName)(state)

// export const getSuccessorVertexNamesByVertexName = (vertexName: string): Selector<IState, string[]> =>
//   state => getSuccessorVertexNames(getVertexByVertexName(vertexName)(state))

export const topologicallyOrderVertices = (vertices: IVertexState[]): IVertexState[] => {
  vertices.sort((firstVertex, secondVertex) => {
    const firstVertexIndex = firstVertex.index
    const secondVertexIndex = secondVertex.index

    if (firstVertexIndex < secondVertexIndex) {
      return -1
    } else {
      return +1
    }
  })

  return vertices
}

// export const validateEdgeByVertices(sourceVertex: Vertex, targetVertex: Vertex): Vertex[] {
//     let cyclicVertices = null

//     const forwardsAffectedVertices = targetVertex.getForwardsAffectedVertices(sourceVertex)
//     const lastForwardsAffectedVertex = forwardsAffectedVertices[forwardsAffectedVertices.length - 1]
//     const cyclePresent = (lastForwardsAffectedVertex === sourceVertex)

//     if (cyclePresent) {
//       cyclicVertices = forwardsAffectedVertices
//     } else {
//       const backwardsAffectedVertices = sourceVertex.getBackwardsAffectedVertices()

//       topologicallyOrderVertices(backwardsAffectedVertices)

//       topologicallyOrderVertices(forwardsAffectedVertices)

//       const affectedVertices = [].concat(backwardsAffectedVertices).concat(forwardsAffectedVertices)
//       const affectedVertexIndices = affectedVertices.map((affectedVertex) => {
//         return affectedVertex.getIndex()
//       })

//       affectedVertexIndices.sort()

//       affectedVertices.forEach((affectedVertex, index) => {
//         const affectedVertexIndex = affectedVertexIndices[index]
//         affectedVertex.setIndex(affectedVertexIndex)
//       })
//     }

//     return cyclicVertices
//   }

// export const getPredecessorVertexMap: Selector<IVertexState, IVertexMap> = state => {
//   let predecessorVertexMap: IVertexMap = {}
//   state.immediatePredecessorVertices.forEach((vertex: Vertex) => {
//     const predecessorVertexName = vertex.getName()
//     predecessorVertexMap[predecessorVertexName] = vertex
//   })

//   return predecessorVertexMap
// }

// export const getSuccessorVertexMap: Selector<IVertexState, IVertexMap> = state => {
//   let successorVertexMap: IVertexMap = {}
//   state.immediateSuccessorVertices.forEach((vertex: Vertex) => {
//     const successorVertexName = vertex.getName()
//     successorVertexMap[successorVertexName] = vertex
//   })

//   return successorVertexMap
// }
//   const forwardsAffectedVertices = targetVertex.getForwardsAffectedVertices(sourceVertex)
//   const lastForwardsAffectedVertex = forwardsAffectedVertices[forwardsAffectedVertices.length - 1]
//   const cyclePresent = (lastForwardsAffectedVertex === sourceVertex)

//   if (cyclePresent) {
//     cyclicVertices = forwardsAffectedVertices
//   } else {
//     const backwardsAffectedVertices = sourceVertex.getBackwardsAffectedVertices()

//     topologicallyOrderVertices(backwardsAffectedVertices)

//     topologicallyOrderVertices(forwardsAffectedVertices)

//     const affectedVertices = [].concat(backwardsAffectedVertices).concat(forwardsAffectedVertices)
//     const affectedVertexIndices = affectedVertices.map((affectedVertex) => {
//       return affectedVertex.getIndex()
//     })

//     affectedVertexIndices.sort()

//     affectedVertices.forEach((affectedVertex, index) => {
//       const affectedVertexIndex = affectedVertexIndices[index]
//       affectedVertex.setIndex(affectedVertexIndex)
//     })
//   }

//   return cyclicVertices
// }

export const getTopologicallyOrderedVertexNames: Selector<IState, string[]> = state =>
  vertexNamesFromVertices(topologicallyOrderVertices(getVertexValues(state)))

export const vertexNamesFromVertices = (vertices: IVertexState[]): string[] => {
  const vertexNames = vertices.map((vertex) => {
    const vertexName = vertex.name

    return vertexName
  })

  return vertexNames
}

export interface ISetVertexByVertexName {
  type: 'SET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName: string,
    vertex: IVertexState
  }
}

export const setVertexByVertexName = (vertexName: string, vertex: IVertexState): ISetVertexByVertexName => ({
  type: 'SET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName,
    vertex
  }
})

export interface IUnsetVertexByVertexName {
  type: 'UNSET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName: string
  }
}

export const unsetVertexByVertexName = (vertexName: string) => ({
  type: 'UNSET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName
  }
})

// export const addVertexByVertexName = (vertexName: string):
//   ThunkAction<IVertexState, IState, never> => (dispatch, getState) => {
//     const state = getState()
//     const vertexPresent = isVertexPresentByVertexName(vertexName)(state)

//     if (!vertexPresent) {
//       const vertex = Vertex.fromNameAndIndex(vertexName, getVertexNames(state).length)
//       dispatch(setVertexByVertexName(vertexName, vertex))
//     }

//     const vertex = getVertexByVertexName(vertexName)(state)

//     return vertex
//   }

// depends on BDFS and FDFS
// export const addEdgeByVertexNames = (sourceVertexName: string, targetVertexName: string):
//   ThunkAction<string[], IState, never> => (dispatch, getState) => {
//     let cyclicVertices = null
//     const state = getState()

//     if (sourceVertexName === targetVertexName) {
//       cyclicVertices = [getVertexByVertexName(sourceVertexName)(state)]
//     } else {
//       const sourceVertex = dispatch(addVertexByVertexName(sourceVertexName))
//       const targetVertex = dispatch(addVertexByVertexName(targetVertexName))
//       const edgePresent = sourceVertex.isEdgePresentByTargetVertex(targetVertex)

//       if (!edgePresent) {
//         const sourceVertexIndex = getIndex(sourceVertexName)(state)
//         const targetVertexIndex = getIndex(targetVertexName)(state)
//         const invalidateEdge = (sourceVertexIndex > targetVertexIndex)

//         if (invalidateEdge) {
//           cyclicVertices = validateEdgeByVertices(sourceVertex, targetVertex)
//         }

//         const cycleMissing = (cyclicVertices === null)

//         if (cycleMissing) {
//           addImmediateSuccessorVertex(sourceVertexName, targetVertex)
//           addImmediatePredecessorVertex(sourceVertexName, sourceVertex)
//         }
//       }
//     }

//     const cyclicVertexNames = (cyclicVertices !== null) ? vertexNamesFromVertices(cyclicVertices) : null

//     return cyclicVertexNames
//   }

// export const addEdge = (edge: Edge): ThunkAction<string[], IState, never> => (dispatch) => {
//   const sourceVertexName = edge.getSourceVertexName()
//   const targetVertexName = edge.getTargetVertexName()
//   const cyclicVertexNames = dispatch(addEdgeByVertexNames(sourceVertexName, targetVertexName))

//   return cyclicVertexNames
// }

// TODO edge
export interface IRemoveEdge {
  type: 'REMOVE_EDGE',
  payload: {
    edge: Edge
  }
}

export const removeEdge = (edge: Edge) => ({
  type: 'REMOVE_EDGE',
  payload: {
    edge
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

export type IAction = ISetVertexByVertexName | IUnsetVertexByVertexName |
  ISetVertexName | ISetVertexIndex | ISetVertexVisited |
  IRemoveImmediatePredecessorVertex |
  IRemoveImmediateSuccessorVertex | IAddImmediatePredecessorVertex |
  IAddImmediateSuccessorVertex | IResetVisited |
  IRemoveAllImmediatePredecessorVertices | IRemoveAllImmediateSuccessorVertices |
  IAppendVertexToState

export const reducer = (state: IState = { vertexMap: {} }, action: IAction): IState => {
  switch (action.type) {
    case 'APPEND_VERTEX_TO_STATE':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertex.name]: action.payload.vertex
        }
      }
    case 'SET_VERTEX_NAME':
      // this is done directly instead of returning new state
      let swap = state.vertexMap[action.payload.currentName]
      delete state.vertexMap[action.payload.currentName]
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.newName]: swap
        }
      }
    case 'SET_VERTEX_INDEX':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            index: action.payload.index
          }
        }
      }
    case 'SET_VERTEX_VISITED':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            visited: action.payload.visited
          }
        }
      }
    case 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX':
      
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediatePredecessorVertices: remove(
              state.vertexMap[action.payload.vertexName].immediatePredecessorVertices,
              action.payload.vertexToRemove
            )
          }
        }
      }
    case 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediateSuccessorVertices: remove(
              state.vertexMap[action.payload.vertexName].immediateSuccessorVertices,
              action.payload.vertexToRemove
            )
          }
        }
      }
    case 'ADD_IMMEDIATE_PREDECESSOR_VERTEX':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediatePredecessorVertices: [
              ...state.vertexMap[action.payload.vertexName].immediatePredecessorVertices,
              action.payload.vertexToAdd
            ]
          }
        }
      }
    case 'ADD_IMMEDIATE_SUCCESSOR_VERTEX':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediateSuccessorVertices: [
              ...state.vertexMap[action.payload.vertexName].immediateSuccessorVertices,
              action.payload.vertexToAdd
            ]
          }
        }
      }
    case 'RESET_VISITED':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            visited: false
          }
        }
      }
    case 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediatePredecessorVertices: []
          }
        }
      }
    case 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediateSuccessorVertices: []
          }
        }
      }
    case 'SET_VERTEX_BY_VERTEX_NAME':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: action.payload.vertex
        }
      }
    case 'UNSET_VERTEX_BY_VERTEX_NAME':
      return {
        ...state,
        vertexMap: omit(state.vertexMap[action.payload.vertexName])
      }
    default:
      return state
  }
}

// Vertex methods

export interface IVertexState {
  name: string,
  index: number,
  visited: boolean,
  immediatePredecessorVertices: string[],
  immediateSuccessorVertices: string[]
}

// completely unnecessary
export const getName = (vertexName: string): Selector<IState, string> =>
  state => state.vertexMap[vertexName].name

export const getIndex = (vertexName: string): Selector<IState, number> =>
  state => state.vertexMap[vertexName].index

export const isVisited = (vertexName: string): Selector<IState, boolean> =>
  state => state.vertexMap[vertexName].visited

export const getImmediatePredecessorVertices = (vertexName: string): Selector<IState, string[]> =>
  state => state.vertexMap[vertexName].immediatePredecessorVertices

export const getImmediateSuccessorVertices = (vertexName: string): Selector<IState, string[]> =>
  state => state.vertexMap[vertexName].immediateSuccessorVertices

export const getPredecessorVertexNames = (vertexName: string): Selector<IState, string[]> =>
  state => {
    const allPredecessorVertexNames: string[] = [...state.vertexMap[vertexName].immediatePredecessorVertices]
    allPredecessorVertexNames.forEach((vertexName) => {
      allPredecessorVertexNames.push(...state.vertexMap[vertexName].immediatePredecessorVertices)
      getPredecessorVertices(vertexName)
    })
    return allPredecessorVertexNames
  }

export const getSuccessorVertexNames = (vertexName: string): Selector<IState, string[]> =>
  state => {
    const allSuccessorVertexNames: string[] = [...state.vertexMap[vertexName].immediateSuccessorVertices]
    allSuccessorVertexNames.forEach((vertexName) => {
      allSuccessorVertexNames.push(...state.vertexMap[vertexName].immediateSuccessorVertices)
      getSuccessorVertices(vertexName)
    })
    return allSuccessorVertexNames
  }

// TODO: cleaner code
export const getPredecessorVertices = (vertexName: string): Selector<IState, IVertexState[]> =>
  state => {
    const allPredecessorVertexNames: string[] = [...state.vertexMap[vertexName].immediatePredecessorVertices]
    allPredecessorVertexNames.forEach((vertexName) => {
      allPredecessorVertexNames.push(...state.vertexMap[vertexName].immediatePredecessorVertices)
      getPredecessorVertices(vertexName)
    })
    const allPredecessorVertex = allPredecessorVertexNames.map((vertexName) => state.vertexMap[vertexName])
    return allPredecessorVertex
  }

export const getSuccessorVertices = (vertexName: string): Selector<IState, IVertexState[]> =>
  state => {
    const allSuccessorVertexNames: string[] = [...state.vertexMap[vertexName].immediateSuccessorVertices]
    allSuccessorVertexNames.forEach((vertexName) => {
      allSuccessorVertexNames.push(...state.vertexMap[vertexName].immediateSuccessorVertices)
      getSuccessorVertices(vertexName)
    })
    const allSuccessorVertex = allSuccessorVertexNames.map((vertexName) => state.vertexMap[vertexName])
    return allSuccessorVertex
  }

export const getTopologicallyOrderedPredecessorVertexNames = (vertexName: string): Selector<IState, string[]> =>
  state => vertexNamesFromVertices(topologicallyOrderVertices(getPredecessorVertices(vertexName)(state)))

export const isVertexImmediatePredecessorVertex = (vertexName: string, vertexToLookUp: string): Selector<IState, boolean> =>
  state => state.vertexMap[vertexName].immediatePredecessorVertices.includes(vertexToLookUp)

export const isVertexImmediateSuccessorVertex = (vertexName: string, vertexToLookUp: string): Selector<IState, boolean> =>
  state => state.vertexMap[vertexName].immediateSuccessorVertices.includes(vertexToLookUp)

export interface ISetVertexName {
  type: 'SET_VERTEX_NAME',
  payload: {
    currentName: string,
    newName: string
  }
}

export const setVertexName = (currentName: string, newName: string): ISetVertexName => ({
  type: 'SET_VERTEX_NAME',
  payload: {
    currentName,
    newName
  }
})

export interface ISetVertexIndex {
  type: 'SET_VERTEX_INDEX',
  payload: {
    index: number,
    vertexName: string
  }
}

export const setVertexIndex = (vertexName: string, index: number): ISetVertexIndex => ({
  type: 'SET_VERTEX_INDEX',
  payload: {
    vertexName,
    index
  }
})

export interface ISetVertexVisited {
  type: 'SET_VERTEX_VISITED',
  payload: {
    vertexName: string
    visited: boolean,
  }
}

export const setVisited = (vertexName: string, visited: boolean): ISetVertexVisited => ({
  type: 'SET_VERTEX_VISITED',
  payload: {
    vertexName,
    visited
  }
})

export interface IRemoveImmediatePredecessorVertex {
  type: 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName: string,
    vertexToRemove: string
  }
}

export const removeImmediatePredecessorVertex = (vertexName: string, vertexToRemove: string): IRemoveImmediatePredecessorVertex => ({
  type: 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName,
    vertexToRemove
  }
})

export interface IRemoveImmediateSuccessorVertex {
  type: 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName: string,
    vertexToRemove: string
  }
}

export const removeImmediateSuccessorVertex = (vertexName: string, vertexToRemove: string): IRemoveImmediateSuccessorVertex => ({
  type: 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName,
    vertexToRemove
  }
})

export interface IResetVisited {
  type: 'RESET_VISITED',
  payload: {
    vertexName: string
  }
}

export const resetVisited = (vertexName: string): IResetVisited => ({
  type: 'RESET_VISITED',
  payload: {
    vertexName
  }
})

// TODO: automatically add to successors meta
// and check if it exists at all
export interface IAddImmediatePredecessorVertex {
  type: 'ADD_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName: string
    vertexToAdd: string
  }
}

export const addImmediatePredecessorVertex = (vertexName: string, vertexToAdd: string): IAddImmediatePredecessorVertex => ({
  type: 'ADD_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName,
    vertexToAdd
  }
})

export interface IAddImmediateSuccessorVertex {
  type: 'ADD_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName: string
    vertexToAdd: string
  }
}

export const addImmediateSuccessorVertex = (vertexName: string, vertexToAdd: string): IAddImmediateSuccessorVertex => ({
  type: 'ADD_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName,
    vertexToAdd
  }
})

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

export interface IRemoveAllImmediatePredecessorVertices {
  type: 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES',
  payload: {
    vertexName: string
  }
}

export const removeAllImmediatePredecessorVertices = (vertexName: string): IRemoveAllImmediatePredecessorVertices => ({
  type: 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES',
  payload: {
    vertexName
  }
})

export interface IRemoveAllImmediateSuccessorVertices {
  type: 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES',
  payload: {
    vertexName: string
  }
}

export const removeAllImmediateSuccessorVertices = (vertexName: string): IRemoveAllImmediateSuccessorVertices => ({
  type: 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES',
  payload: {
    vertexName
  }
})

export interface IAppendVertexToState {
  type: 'APPEND_VERTEX_TO_STATE',
  payload: {
    vertex: IVertexState
  }
}

export const appendVertexToState = (vertex: IVertexState): IAppendVertexToState => ({
  type: 'APPEND_VERTEX_TO_STATE',
  payload: {
    vertex
  }
})

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
