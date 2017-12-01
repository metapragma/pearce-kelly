import {
  Selector,
  IState,
  IVertexState
} from '../types'

import {
  getVertexValues,
  getVertexNames,
  isEmpty,
  getVertexByVertexName,
  isVertexPresentByVertexName,
  isEdgePresentByVertexNames,
  isVertexImmediatePredecessorVertex,
  isVertexImmediateSuccessorVertex,
  getName,
  getIndex,
  isVisited,
  getImmediatePredecessorVertices,
  getImmediateSuccessorVertices,
  getPredecessorVertexNames,
  getSuccessorVertexNames,
  getPredecessorVertices,
  getSuccessorVertices, 
  vertexNamesFromVertices,
  topologicallyOrderVertices,
  getTopologicallyOrderedVertexNames,
  getTopologicallyOrderedPredecessorVertexNames
} from './selectors'

import {
  setVertexByVertexName,
  unsetVertexByVertexName,
  setVertexName,
  setVertexIndex,
  setVertexVisited,
  addImmediatePredecessorVertex,
  addImmediateSuccessorVertex,
  removeImmediatePredecessorVertex,
  removeImmediateSuccessorVertex,
  resetVisited,
  removeAllImmediatePredecessorVertices,
  removeAllImmediateSuccessorVertices,
  appendVertexToState,
  createVertex,
  removeEdgeByVertexNames,
  removeVertexByVertexName,
  removeEdgesBySourceVertexName,
  removeEdgesByTargetVertexName,
  removeIncomingEdges,
  removeOutgoingEdges
} from './actions'

import {
  IAction,
  reducer
} from './reducer'

export {
  getVertexValues,
  getVertexNames,
  isEmpty,
  getVertexByVertexName,
  isVertexPresentByVertexName,
  isEdgePresentByVertexNames,
  isVertexImmediatePredecessorVertex,
  isVertexImmediateSuccessorVertex,
  getName,
  getIndex,
  isVisited,
  getImmediatePredecessorVertices,
  getImmediateSuccessorVertices,
  getPredecessorVertexNames,
  getSuccessorVertexNames,
  getPredecessorVertices,
  getSuccessorVertices,
  vertexNamesFromVertices,
  topologicallyOrderVertices,
  getTopologicallyOrderedVertexNames,
  getTopologicallyOrderedPredecessorVertexNames,
  setVertexByVertexName,
  unsetVertexByVertexName,
  setVertexName,
  setVertexIndex,
  setVertexVisited,
  addImmediatePredecessorVertex,
  addImmediateSuccessorVertex,
  removeImmediatePredecessorVertex,
  removeImmediateSuccessorVertex,
  resetVisited,
  removeAllImmediatePredecessorVertices,
  removeAllImmediateSuccessorVertices,
  appendVertexToState,
  createVertex,
  removeEdgeByVertexNames,
  removeVertexByVertexName,
  removeEdgesBySourceVertexName,
  removeEdgesByTargetVertexName,
  removeIncomingEdges,
  removeOutgoingEdges,
  IAction,
  reducer
}

import { createStore, applyMiddleware } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk' 

// TODO for this function to work correctly if a predecessor add event is fired
// it should automatically update successor of 2nd vertex
// export const isEdgePresentByVertexNames = (sourceVertexName: string, targetVertexName: string):
//   Selector<IState, boolean> =>
//   state => {
//     let edgePresent = false

//     const sourceVertexAndTargetVertexPresent =
//       getVertexByVertexName(sourceVertexName)(state) !== null &&
//       getVertexByVertexName(targetVertexName)(state) !== null

//     if (sourceVertexAndTargetVertexPresent) {
     
//       edgePresent =
//         (
//           isVertexImmediatePredecessorVertex(targetVertexName, sourceVertexName)(state)
//             || 
//           isVertexImmediatePredecessorVertex(sourceVertexName, targetVertexName)(state)
//         )
//     }

//     return edgePresent
//   }

// export const isEdgePresent = (edge: Edge): Selector<IState, boolean> => state =>
//   isEdgePresentByVertexNames(edge.getSourceVertexName(), edge.getTargetVertexName())(state)

// depends on getFAV

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

// retrieveBackwardsAffectedVertices() {
//   const backwardsAffectedVertices = this.backwardsDepthFirstSearch(function (visitedVertex) {
//     const terminate = false

//     return terminate
//   })

//   return backwardsAffectedVertices  
// }

// retrieveBackwardsVisitedVertices(callback) {
//   let terminate = false

//   if (this.visited === false) {
//     this.visited = true

//     const visitedVertex = this  

//     terminate = callback(visitedVertex)

//     if (terminate !== true) {
//       visitedVertex.someImmediatePredecessorVertex(function (immediatePredecessorVertex) {
//         terminate = immediatePredecessorVertex.retrieveBackwardsVisitedVertices(callback)

//         return terminate
//       })
//     }
//   }

//   return terminate
// }

// backwardsDepthFirstSearch(callback) {
//   const visitedVertices = []

//   this.retrieveBackwardsVisitedVertices(function (visitedVertex) {
//     const terminate = callback(visitedVertex)  ///

//     visitedVertices.push(visitedVertex)

//     return terminate
//   })

//   visitedVertices.forEach(function (visitedVertex) {
//     visitedVertex.resetVisited()
//   })

//   return visitedVertices
// }

let store = createStore(reducer, applyMiddleware(thunk))
const state = store.getState()

export const retrieveBackwardsVisitedVertices = (vertexNameToLookup: string, callback: (vertexNameToLookup: string) => boolean): boolean => {
  let terminate = false

  if (isVisited(vertexNameToLookup)(state) === false) {
    setVertexVisited(vertexNameToLookup, true)

    const visitedVertex = vertexNameToLookup

    terminate = callback(visitedVertex)

    if (terminate !== true) {
      state.vertexMap.vertexNameToLookup.immediatePredecessorVertices.some((immediatePredecessorVertex) => {
        terminate = retrieveBackwardsVisitedVertices(immediatePredecessorVertex, callback)

        return terminate
      })
    }
  }

  return terminate
}

export const backwardsDepthFirstSearch = (vertexNameToLookup: string): Array<string> => {
  const visitedVertices: Array<string> = []

  retrieveBackwardsVisitedVertices(vertexNameToLookup, (vertexNameToLookup) => {
    const terminate = false  ///

    visitedVertices.push(vertexNameToLookup)

    return terminate
  })

  visitedVertices.forEach(function (visitedVertex) {
    resetVisited(visitedVertex)
  })

  return visitedVertices
}

// export const retrieveForwardsAffectedVertices = (sourceVertex: IVertexState): IVertexState[] => {
//   const forwardsAffectedVertices = forwardsDepthFirstSearch((visitedVertex: IVertexState) => {
//     const terminate = (visitedVertex === sourceVertex)
    
//     return terminate
//   })
  
//   return forwardsAffectedVertices
// }

// const retrieveForwardsVisitedVertices = (callback) => {
//   let terminate = false

//   if (this.visited === false) {
//     this.visited = true

//     const visitedVertex = this  ///

//     terminate = callback(visitedVertex)

//     if (terminate !== true) {
//       visitedVertex.someImmediateSuccessorVertex(function(immediateSuccessorVertex) {
//         terminate = immediateSuccessorVertex.retrieveForwardsVisitedVertices(callback)

//         return terminate
//       })
//     }
//   }

//   return terminate
// }

// const forwardsDepthFirstSearch = (callback: (visitedVertex: IVertexState) => boolean): IVertexState[] => {
//   const visitedVertices: IVertexState[] = []

//   retrieveForwardsVisitedVertices((visitedVertex: IVertexState) => {
//     const terminate = callback(visitedVertex)  ///

//     visitedVertices.push(visitedVertex)

//     return terminate
//   })

  // visitedVertices.forEach(function(visitedVertex) {
  //   visitedVertex.resetVisited()
  // })

//   return visitedVertices
// }

// TODO edge
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
