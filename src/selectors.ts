import {
  Selector,
  IState,
  IVertexState
} from '../types'

export const getVertexValues: Selector<IState, IVertexState[]> = state =>
  Object.keys(state.vertexMap).map(key => state.vertexMap[key])

export const getVertexNames: Selector<IState, string[]> = state => Object.keys(state.vertexMap)

export const isEmpty: Selector<IState, boolean> = state => getVertexValues(state).length === 0 ? true : false

export const getVertexByVertexName = (vertexName: string): Selector<IState, IVertexState | null> =>
  state => {
    if (isVertexPresentByVertexName(vertexName)(state) === true) {
      return state.vertexMap[vertexName]  
    } else {
      return null
    }
  }

// Array.prototype.includes() is unknown to TS, henc indexOf()
export const isVertexPresentByVertexName = (vertexName: string): Selector<IState, boolean> =>
  state => getVertexNames(state).indexOf(vertexName) !== -1 ? true : false

export const isEdgePresentByVertexNames = (sourceVertexName: string, targetVertexName: string):
  Selector<IState, boolean> =>
  state => {
    let edgePresent = false

    const sourceVertexAndTargetVertexPresent =
      getVertexByVertexName(sourceVertexName)(state) !== null &&
      getVertexByVertexName(targetVertexName)(state) !== null

    if (sourceVertexAndTargetVertexPresent) {
     
      edgePresent =
        (
          isVertexImmediatePredecessorVertex(targetVertexName, sourceVertexName)(state)
            || 
          isVertexImmediatePredecessorVertex(sourceVertexName, targetVertexName)(state)
        )
    }

    return edgePresent
  }

// Array.prototype.includes() is unknown to TS, henc indexOf()
export const isVertexImmediatePredecessorVertex = (vertexName: string, vertexToLookUp: string): Selector<IState, boolean> =>
  state => state.vertexMap[vertexName].immediatePredecessorVertices.indexOf(vertexToLookUp) !== -1 ? true : false

// Array.prototype.includes() is unknown to TS, henc indexOf()
export const isVertexImmediateSuccessorVertex = (vertexName: string, vertexToLookUp: string): Selector<IState, boolean> =>
  state => state.vertexMap[vertexName].immediateSuccessorVertices.indexOf(vertexToLookUp) !== -1 ? true : false

// TODO: error handling for getters
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

// TODO: cleanup code
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

export const vertexNamesFromVertices = (vertices: IVertexState[]): string[] => {
  const vertexNames = vertices.map((vertex) => {
    const vertexName = vertex.name

    return vertexName
  })

  return vertexNames
}

export const getTopologicallyOrderedVertexNames: Selector<IState, string[]> = state =>
  vertexNamesFromVertices(topologicallyOrderVertices(getVertexValues(state)))

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

export const getTopologicallyOrderedPredecessorVertexNames = (vertexName: string): Selector<IState, string[]> =>
  state => vertexNamesFromVertices(topologicallyOrderVertices(getPredecessorVertices(vertexName)(state)))
