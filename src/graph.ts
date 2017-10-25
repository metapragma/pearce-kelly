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
          isVertexImmediateSuccessorVertex(sourceVertexName, targetVertex)(state) && 
          isVertexImmediatePredecessorVertex(targetVertexName, sourceVertex)(state)
      }

      return edgePresent
    }

export const isEdgePresent = (edge: Edge): Selector<IState, boolean> => state =>
  isEdgePresentByVertexNames(edge.getSourceVertexName(), edge.getTargetVertexName())(state)

export const getPredecessorVertexNamesByVertexName = (vertexName: string): Selector<IState, string[]> =>
  state => getPredecessorVertexNames(getVertexByVertexName(vertexName)(state))

export const getSuccessorVertexNamesByVertexName = (vertexName: string): Selector<IState, string[]> =>
  state => getSuccessorVertexNames(getVertexByVertexName(vertexName)(state))

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

// export const validateEdgeByVertices = (sourceVertex: Vertex, targetVertex: Vertex): Vertex[] => {
//   let cyclicVertices = null

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

// TODO
export const addVertexByVertexName = (vertexName: string):
  ThunkAction<Vertex, IState, never> => (dispatch, getState) => {
    const state = getState()
    const vertexPresent = isVertexPresentByVertexName(vertexName)(state)

    // create vertex
    if (!vertexPresent) {
      const vertex = Vertex.fromNameAndIndex(vertexName, getVertexNames(state).length)
      dispatch(setVertexByVertexName(vertexName, vertex))
    }

    const vertex = getVertexByVertexName(vertexName)(state)

    return vertex
  }

// depends on BDFS and FDFS
export const addEdgeByVertexNames = (sourceVertexName: string, targetVertexName: string):
  ThunkAction<string[], IState, never> => (dispatch, getState) => {
    let cyclicVertices = null
    const state = getState()

    if (sourceVertexName === targetVertexName) {
      cyclicVertices = [getVertexByVertexName(sourceVertexName)(state)]
    } else {
      const sourceVertex = dispatch(addVertexByVertexName(sourceVertexName))
      const targetVertex = dispatch(addVertexByVertexName(targetVertexName))
      const edgePresent = sourceVertex.isEdgePresentByTargetVertex(targetVertex)

      if (!edgePresent) {
        const sourceVertexIndex = sourceVertex.getIndex()
        const targetVertexIndex = targetVertex.getIndex()
        const invalidateEdge = (sourceVertexIndex > targetVertexIndex)

        if (invalidateEdge) {
          cyclicVertices = validateEdgeByVertices(sourceVertex, targetVertex)
        }

        const cycleMissing = (cyclicVertices === null)

        if (cycleMissing) {
          sourceVertex.addImmediateSuccessorVertex(targetVertex)
          targetVertex.addImmediatePredecessorVertex(sourceVertex)
        }
      }
    }

    const cyclicVertexNames = (cyclicVertices !== null) ? vertexNamesFromVertices(cyclicVertices) : null

    return cyclicVertexNames
  }

export const addEdge = (edge: Edge): ThunkAction<string[], IState, never> => (dispatch) => {
  const sourceVertexName = edge.getSourceVertexName()
  const targetVertexName = edge.getTargetVertexName()
  const cyclicVertexNames = dispatch(addEdgeByVertexNames(sourceVertexName, targetVertexName))

  return cyclicVertexNames
}

// TODO: depends on removeEdgeByVertexNames()
// export interface IRemoveEdge {
//   type: 'REMOVE_EDGE',
//   payload: {
//     edge: Edge
//   }
// }

// export const removeEdge = (edge: Edge) => ({
//   type: 'REMOVE_EDGE',
//   payload: {
//     edge
//   }
// })

// TODO: depends on vertex reducer
// export const removeEdgeByVertexNames = (sourceVertexName: string, targetVertexName: string):
//   ThunkAction<void, IState, never> => (dispatch, getState) => {
//     const state = getState()
//     const edgePresent = isEdgePresentByVertexNames(sourceVertexName, targetVertexName)(state)
//     if (edgePresent) {
//       const sourceVertex = getVertexByVertexName(sourceVertexName)(state)
//       const targetVertex = getVertexByVertexName(targetVertexName)(state)
//       sourceVertex.removeImmediateSuccessorVertex(targetVertex)
//       targetVertex.removeImmediatePredecessorVertex(sourceVertex)
//     }
//   }

// TODO: depends on vertex internal methods
// export const removeVertexByVertexName = (vertexName: string): 
//   ThunkAction<Edge[], IState, never> => (dispatch, getState) => {
//     const state = getState()
//     let removedEdges: Edge[] | null = null

//     const vertexPresent = this.isVertexPresentByVertexName(vertexName)

//     if (vertexPresent) {
//       removedEdges = []

//       const vertex = this.getVertexByVertexName(vertexName)

//       vertex.immediateSuccessorVertices.forEach((immediateSuccessorVertex) => {
//         removedEdges.push(new Edge(vertex.getName(), immediateSuccessorVertex.getName()))
//         immediateSuccessorVertex.removeImmediatePredecessorVertex(vertex)
//       })
//       vertex.immediatePredecessorVertices.forEach((immediatePredecessorVertex) => {
//         removedEdges.push(new Edge(immediatePredecessorVertex.getName(), vertex.getName()))
//         immediatePredecessorVertex.removeImmediateSuccessorVertex(vertex)
//       })
//       this.unsetVertexByVertexName(vertexName)
//     }

//     return removedEdges
//   }

// TODO: depends on vertex internal method
// export const removeEdgesBySourceVertexName = (sourceVertexName: string): 
//   ThunkAction<void, IState, never> => (dispatch, getState) => {
//     const state = getState()
//     const sourceVertexPresent = isVertexPresentByVertexName(sourceVertexName)(state)

//     if (sourceVertexPresent) {
//       getVertexByVertexName(sourceVertexName)(state).removeOutgoingEdges()
//     }
// }

// TODO: depends on vertex internal method
// export const removeEdgesByTargetVertexName = (targetVertexName: string): 
//   ThunkAction<void, IState, never> => (dispatch, getState) => {
//     const state = getState()
//     const sourceVertexPresent = isVertexPresentByVertexName(targetVertexName)(state)

//     if (sourceVertexPresent) {
//       getVertexByVertexName(targetVertexName)(state).removeIncomingEdges()
//     }
// }

export type IAction = ISetVertexByVertexName | IUnsetVertexByVertexName |
                      ISetVertexName | ISetVertexIndex | ISetVertexVisited | 
                      IRemoveImmediatePredecessorVertex |
                      IRemoveImmediateSuccessorVertex | IAddImmediatePredecessorVertex |
                      IAddImmediateSuccessorVertex | IResetVisited | 
                      IRemoveAllImmediatePredecessorVertices | IRemoveAllImmediateSuccessorVertices

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case 'SET_VERTEX_NAME': 
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.newName]: {
            ...state.vertexMap[action.payload.currentName]
          }
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
              action.payload.vertex
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
              action.payload.vertex
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
              action.payload.vertex
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
              action.payload.vertex
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
  immediatePredecessorVertices: IVertexState[],
  immediateSuccessorVertices: IVertexState[]
}

// completely unnecessary
export const getName = (vertexName: string): Selector<IState, string> => 
  state => state.vertexMap[vertexName].name

export const getIndex = (vertexName: string): Selector<IState, number> => 
  state => state.vertexMap[vertexName].index

export const isVisited = (vertexName: string): Selector<IState, boolean> => 
  state => state.vertexMap[vertexName].visited

export const getImmediatePredecessorVertices = (vertexName: string): Selector<IState, IVertexState[]> => 
  state => state.vertexMap[vertexName].immediatePredecessorVertices

export const getImmediateSuccessorVertices = (vertexName: string): Selector<IState, IVertexState[]> => 
  state => state.vertexMap[vertexName].immediateSuccessorVertices

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

export const getPredecessorVertexNames = (vertex: IVertexState) => {
  let predecessorVertexNames: string[] = []
  vertex.immediatePredecessorVertices.forEach((vertex) => {
    predecessorVertexNames.push(vertex.name)
  })
  return predecessorVertexNames
}

export const getSuccessorVertexNames = (vertex: IVertexState) => {
  let successorVertexNames: string[] = []
  vertex.immediateSuccessorVertices.forEach((vertex) => {
    successorVertexNames.push(vertex.name)
  })
  return successorVertexNames
}

export const getPredecessorVertices = (vertexName: string): Selector<IState, IVertexState[]> =>
   state => state.vertexMap[vertexName].immediatePredecessorVertices

export const getSuccessorVertices = (vertexName: string): Selector<IState, IVertexState[]> =>
   state => state.vertexMap[vertexName].immediateSuccessorVertices

export const getTopologicallyOrderedPredecessorVertexNames = (vertexName: string): Selector<IState, string[]> =>
  state => vertexNamesFromVertices(topologicallyOrderVertices(getPredecessorVertices(vertexName)(state)))

export const isVertexImmediatePredecessorVertex = (vertexName: string, vertex: IVertexState): Selector<IState, boolean> =>
  state => state.vertexMap[vertexName].immediatePredecessorVertices.includes(vertex)

export const isVertexImmediateSuccessorVertex = (vertexName: string, vertex: IVertexState): Selector<IState, boolean> =>
  state => state.vertexMap[vertexName].immediateSuccessorVertices.includes(vertex)

export interface ISetVertexName {
  type: 'SET_VERTEX_NAME',
  payload: {
    newName: string,
    currentName: string
  }
}

export const setVertexName = (newName: string, currentName: string): ISetVertexName => ({
  type: 'SET_VERTEX_NAME',
  payload: {
    newName, 
    currentName
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
    vertex: IVertexState
  }
}

export const removeImmediatePredecessorVertex = (vertexName: string, vertex: IVertexState): IRemoveImmediatePredecessorVertex => ({
  type: 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName,
    vertex
  }
})

export interface IRemoveImmediateSuccessorVertex {
  type: 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName: string,
    vertex: IVertexState
  }
}

export const removeImmediateSuccessorVertex = (vertexName: string, vertex: IVertexState): IRemoveImmediateSuccessorVertex => ({
  type: 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName,
    vertex
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

export interface IAddImmediatePredecessorVertex {
  type: 'ADD_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName: string
    vertex: IVertexState
  }
}

export const addImmediatePredecessorVertex = (vertexName: string, vertex: IVertexState): IAddImmediatePredecessorVertex => ({
  type: 'ADD_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName,
    vertex
  }
})

export interface IAddImmediateSuccessorVertex {
  type: 'ADD_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName: string
    vertex: IVertexState
  }
}

export const addImmediateSuccessorVertex = (vertexName: string, vertex: IVertexState): IAddImmediateSuccessorVertex => ({
  type: 'ADD_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName,
    vertex
  }
})

export const removeIncomingEdges = ():
  ThunkAction<void, IVertexState, never> => (dispatch, getState) => {
    const state = getState()
    const immediateSuccessorVertex = state
    
    state.immediatePredecessorVertices.forEach((immediatePredecessorVertex) => {
      dispatch(removeImmediateSuccessorVertex(immediatePredecessorVertex))
    })

    dispatch(removeAllImmediatePredecessorVertices)
  }

export const removeOutgoingEdges = ():
  ThunkAction<void, IVertexState, never> => (dispatch, getState) => {
    const state = getState()
    const immediatePredecessorVertex = state
    
    state.immediateSuccessorVertices.forEach((immediateSuccessorVertex) => {
      dispatch(removeImmediatePredecessorVertex(immediateSuccessorVertex))
    })

    dispatch(removeAllImmediateSuccessorVertices)
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
