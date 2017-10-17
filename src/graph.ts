import { Vertex, IVertexMap } from './vertex'
import Edge from './edge'

import { Dispatch } from 'redux'
import { ThunkAction } from 'redux-thunk'
import { omit } from 'lodash'

export type Selector<S, R> = (state: S) => R

export interface IState {
  vertexMap: IVertexMap
}

export const getVertexValues: Selector<IState, Vertex[]> = state =>
  Object.keys(state.vertexMap).map(key => state.vertexMap[key])

export const getVertexNames: Selector<IState, string[]> = state => Object.keys(state.vertexMap)

export const isEmpty: Selector<IState, boolean> = state => getVertexValues(state).length === 0

export const isVertexPresentByVertexName = (vertexName: string): Selector<IState, boolean> =>
  state => getVertexNames(state).includes(vertexName)

export const getVertexByVertexName = (vertexName: string): Selector<IState, Vertex | null> =>
  state => {
    if (isVertexPresentByVertexName(vertexName)(state) === true) {
      return state.vertexMap[vertexName]
    } else {
      return null
    }
  }

export const isEdgePresentByVertexNames = (sourceVertexName: string, targetVertexName: string):
  Selector<IState, boolean> => state => {
    let edgePresent = false

    const sourceVertex = getVertexByVertexName(sourceVertexName)(state)
    const targetVertex = getVertexByVertexName(targetVertexName)(state)
    const sourceVertexAndTargetVertexPresent = (getVertexByVertexName(sourceVertexName)(state) !== null)
      && (getVertexByVertexName(targetVertexName)(state) !== null)

    if (sourceVertexAndTargetVertexPresent) {
      edgePresent = (sourceVertex.isVertexImmediateSuccessorVertex(targetVertex)
        && targetVertex.isVertexImmediatePredecessorVertex(sourceVertex))
    }

    return edgePresent
  }

export const isEdgePresent = (edge: Edge): Selector<IState, boolean> => state =>
  isEdgePresentByVertexNames(edge.getSourceVertexName(), edge.getTargetVertexName())(state)

export const getPredecessorVertexNamesByVertexName = (vertexName: string): Selector<IState, string[]> =>
  state => getVertexByVertexName(vertexName)(state).getPredecessorVertexNames()

export const getSuccessorVertexNamesByVertexName = (vertexName: string): Selector<IState, string[]> =>
  state => getVertexByVertexName(vertexName)(state).getSuccessorVertexNames()

export const topologicallyOrderVertices = (vertices: Vertex[]): Vertex[] => {
  vertices.sort((firstVertex, secondVertex) => {
    const firstVertexIndex = firstVertex.getIndex()
    const secondVertexIndex = secondVertex.getIndex()

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

export const vertexNamesFromVertices = (vertices: Vertex[]): string[] => {
  const vertexNames = vertices.map((vertex) => {
    const vertexName = vertex.getName()

    return vertexName
  })

  return vertexNames
}

export interface ISetVertexByVertexName {
  type: 'SET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName: string,
    vertex: Vertex
  }
}

export const setVertexByVertexName = (vertexName: string, vertex: Vertex): ISetVertexByVertexName => ({
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

export type IAction = ISetVertexByVertexName | IUnsetVertexByVertexName

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
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
  immediatePredecessorVertices: Vertex[],
  immediateSuccessorVertices: Vertex[]
}

export const getName: Selector<IVertexState, string> = state => state.name

export const getIndex: Selector<IVertexState, number> = state => state.index

export const isVisited: Selector<IVertexState, boolean> = state => state.visited

export const getImmediatePredecessorVertices: Selector<IVertexState, Vertex[]> = state =>
  state.immediatePredecessorVertices

export const getImmediateSuccessorVertices: Selector<IVertexState, Vertex[]> = state =>
  state.immediateSuccessorVertices

export const getPredecessorVertexMap: Selector<IVertexState, IVertexMap> = state => {
  let predecessorVertexMap: IVertexMap = {}
  state.immediatePredecessorVertices.forEach((vertex: Vertex) => {
    const predecessorVertexName = vertex.getName()
    predecessorVertexMap[predecessorVertexName] = vertex
  })

  return predecessorVertexMap
}

export const getSuccessorVertexMap: Selector<IVertexState, IVertexMap> = state => {
  let successorVertexMap: IVertexMap = {}
  state.immediateSuccessorVertices.forEach((vertex: Vertex) => {
    const successorVertexName = vertex.getName()
    successorVertexMap[successorVertexName] = vertex
  })

  return successorVertexMap
}

export const getPredecessorVertexNames: Selector<IVertexState, string[]> = state => {
  let predecessorVertexNames: string[] = []
  state.immediatePredecessorVertices.forEach((vertex) => {
    predecessorVertexNames.push(vertex.getName())
  })
  return predecessorVertexNames
}

export const getSuccessorVertexNames: Selector<IVertexState, string[]> = state => {
  let successorVertexNames: string[] = []
  state.immediateSuccessorVertices.forEach((vertex) => {
    successorVertexNames.push(vertex.getName())
  })
  return successorVertexNames
}

export const getPredecessorVertices: Selector<IVertexState, Vertex[]> = state => {
  const predecessorVertexMap = getPredecessorVertexMap(state)
  return Object.keys(predecessorVertexMap).map((vertexName) => predecessorVertexMap[vertexName])
}

export const getSuccessorVertices: Selector<IVertexState, Vertex[]> = state => {
  const predecessorVertexMap = getPredecessorVertexMap(state)
  return Object.keys(predecessorVertexMap).map((vertexName) => predecessorVertexMap[vertexName])
}

export const getTopologicallyOrderedPredecessorVertexNames: Selector<IVertexState, string[]> =
  state => {
    return vertexNamesFromVertices(topologicallyOrderVertices(getPredecessorVertices(state)))
  }

export const isVertexImmediatePredecessorVertex = (vertex: Vertex): Selector<IVertexState, boolean> =>
  state => {
    return state.immediatePredecessorVertices.includes(vertex)
  }

export const isVertexImmediateSuccessorVertex = (vertex: Vertex): Selector<IVertexState, boolean> =>
  state => {
    return state.immediateSuccessorVertices.includes(vertex)
  }

export const isEdgePresentBySourceVertex = (sourceVertex: Vertex): Selector<IVertexState, boolean> =>
  state => {
    return isVertexImmediatePredecessorVertex(sourceVertex)(state)
  }

export const isEdgePresentByTargetVertex = (targetVertex: Vertex): Selector<IVertexState, boolean> =>
  state => {
    return isVertexImmediateSuccessorVertex(targetVertex)(state)
  }

export interface ISetName {
  type: 'SET_NAME',
  payload: {
    name: string,
  }
}

export const setName = (name: string): ISetName => ({
  type: 'SET_NAME',
  payload: {
    name
  }
})

export interface ISetIndex {
  type: 'SET_INDEX',
  payload: {
    index: number,
  }
}

export const setIndex = (index: number): ISetIndex => ({
  type: 'SET_INDEX',
  payload: {
    index
  }
})

export interface ISetVisited {
  type: 'SET_VISITED',
  payload: {
    visited: boolean,
  }
}

export const setVisited = (visited: boolean): ISetVisited => ({
  type: 'SET_VISITED',
  payload: {
    visited
  }
})

export interface IRemoveImmediatePredecessorVertex {
  type: 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertex: Vertex
  }
}

export const removeImmediatePredecessorVertex = (vertex: Vertex): IRemoveImmediatePredecessorVertex => ({
  type: 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertex
  }
})

export interface IRemoveImmediateSuccessorVertex {
  type: 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertex: Vertex
  }
}

export const removeImmediateSuccessorVertex = (vertex: Vertex): IRemoveImmediateSuccessorVertex => ({
  type: 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertex
  }
})

export interface IResetVisited {
  type: 'RESET_VISITED'
}

export const resetVisited = (): IResetVisited => ({
  type: 'RESET_VISITED'
})

export interface IAddImmediatePredecessorVertex {
  type: 'ADD_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertex: Vertex
  }
}

export const addImmediatePredecessorVertex = (vertex: Vertex): IAddImmediatePredecessorVertex => ({
  type: 'ADD_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertex
  }
})

export interface IAddImmediateSuccessorVertex {
  type: 'ADD_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertex: Vertex
  }
}

export const addImmediateSuccessorVertex = (vertex: Vertex): IAddImmediateSuccessorVertex => ({
  type: 'ADD_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
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
  type: 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES'
}  

export const removeAllImmediatePredecessorVertices = (): IRemoveAllImmediatePredecessorVertices => ({
  type: 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES'
})

export interface IRemoveAllImmediateSuccessorVertices {
  type: 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES'
}  

export const removeAllImmediateSuccessorVertices = (): IRemoveAllImmediateSuccessorVertices => ({
  type: 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES'
})

export type IVertexAction = ISetName | ISetIndex | ISetVisited | IRemoveImmediatePredecessorVertex |
                            IRemoveImmediateSuccessorVertex | IAddImmediatePredecessorVertex |
                            IAddImmediateSuccessorVertex | IResetVisited | 
                            IRemoveAllImmediatePredecessorVertices | IRemoveAllImmediateSuccessorVertices

const vertexReducer = (state: IVertexState, action: IVertexAction): IVertexState => {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.payload.name
      }
    case 'SET_INDEX':
      return {
        ...state,
        index: action.payload.index
      }
    case 'SET_VISITED':
      return {
        ...state,
        visited: action.payload.visited
      }
    case 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX':
      return {
        ...state,
        immediatePredecessorVertices: state.immediatePredecessorVertices.splice
          (state.immediatePredecessorVertices.indexOf(action.payload.vertex), 1)
      }
    case 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX':
      return {
        ...state,
        immediateSuccessorVertices: state.immediateSuccessorVertices.splice
          (state.immediateSuccessorVertices.indexOf(action.payload.vertex), 1)
      }
    case 'ADD_IMMEDIATE_PREDECESSOR_VERTEX':
      return {
        ...state,
        immediatePredecessorVertices: [...state.immediatePredecessorVertices, action.payload.vertex]
      }
    case 'ADD_IMMEDIATE_SUCCESSOR_VERTEX':
      return {
        ...state,
        immediateSuccessorVertices: [...state.immediateSuccessorVertices, action.payload.vertex]
      }
    case 'RESET_VISITED':
      return {
        ...state,
        visited: false
      }
    case 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES': 
      return {
        ...state,
        immediatePredecessorVertices: []
      }
    case 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES': 
      return {
        ...state,
        immediateSuccessorVertices: []
      }
    default:
      return state
  }
}
