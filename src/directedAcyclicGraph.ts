'use strict'

// const necessary = require('necessary')

import Edge from './edge'
import { Vertex, IVertexMap, topologicallyOrderVertices, vertexNamesFromVertices } from './vertex'

export default class DirectedAcyclicGraph {
  vertexMap: IVertexMap
  constructor(vertexMap: IVertexMap) {
    this.vertexMap = vertexMap
  }

  getVertexValues(): any[] {
    // workaround Object.values()
    return Object.keys(this.vertexMap).map(key => this.vertexMap[key])
  }

  getVertexNames(): string[] {
    return Object.keys(this.vertexMap)
  }

  getTopologicallyOrderedVertexNames() {
    const vertices = this.getVertexValues()

    topologicallyOrderVertices(vertices)

    const topologicallyOrderedVertices = vertices, ///
      topologicallyOrderedVertexNames = vertexNamesFromVertices(topologicallyOrderedVertices)

    return topologicallyOrderedVertexNames
  }

  // check return union type
  getVertexByVertexName(vertexName: string): Vertex | null {
    if (this.isVertexPresentByVertexName(vertexName) === true) {
      return this.vertexMap[vertexName]
    } else {
      return null
    }
  }

  setVertexByVertexName(vertexName: string, vertex: any): void {
    this.vertexMap[vertexName] = vertex
  }

  unsetVertexByVertexName(vertexName: string): void {
    delete this.vertexMap[vertexName]
  }

  isEmpty(): boolean {
    return this.getVertexValues.length === 0
  }

  isEdgePresent(edge: Edge): boolean {
    const sourceVertexName = edge.getSourceVertexName(),
      targetVertexName = edge.getTargetVertexName(),
      edgePresent = this.isEdgePresentByVertexNames(sourceVertexName, targetVertexName)

    return edgePresent
  }

  isEdgePresentByVertexNames(sourceVertexName: string, targetVertexName: string): boolean {
    let edgePresent = false

    const sourceVertex = this.getVertexByVertexName(sourceVertexName),
      targetVertex = this.getVertexByVertexName(targetVertexName),
      sourceVertexAndTargetVertexPresent = (sourceVertex !== null) && (targetVertex !== null)

    if (sourceVertexAndTargetVertexPresent) {
      const targetVertexSourceVertexImmediateSuccessorVertex = sourceVertex.isVertexImmediateSuccessorVertex(targetVertex),
        sourceVertexTargetVertexImmediatePredecessorVertex = targetVertex.isVertexImmediatePredecessorVertex(sourceVertex)

      edgePresent = (targetVertexSourceVertexImmediateSuccessorVertex && sourceVertexTargetVertexImmediatePredecessorVertex)
    }

    return edgePresent
  }

  isVertexPresentByVertexName(vertexName: string): boolean {
    return this.getVertexNames().includes(vertexName)
  }

  getPredecessorVertexNamesByVertexName(vertexName: string): string[] {
    const vertex = this.getVertexByVertexName(vertexName),
      predecessorVertexNames = vertex.getPredecessorVertexNames()

    return predecessorVertexNames
  }

  getSuccessorVertexNamesByVertexName(vertexName: string): string[] {
    const vertex = this.getVertexByVertexName(vertexName),
      successorVertexNames = vertex.getSuccessorVertexNames()

    return successorVertexNames
  }

  addVertexByVertexName(vertexName: string): Vertex {
    const vertexPresent = this.isVertexPresentByVertexName(vertexName)

    if (!vertexPresent) {
      const vertexNames = this.getVertexNames(),
        vertexNamesLength = vertexNames.length,
        name = vertexName,  ///
        index = vertexNamesLength, ///
        vertex = Vertex.fromNameAndIndex(name, index)

      this.setVertexByVertexName(vertexName, vertex)
    }

    const vertex = this.getVertexByVertexName(vertexName)

    return vertex
  }
  
  // type of cyclic names
  addEdge(edge: Edge) {
    const sourceVertexName = edge.getSourceVertexName(),
      targetVertexName = edge.getTargetVertexName(),
      cyclicVertexNames = this.addEdgeByVertexNames(sourceVertexName, targetVertexName)

    return cyclicVertexNames
  }

  addEdgeByVertexNames(sourceVertexName: string, targetVertexName: string) {
    let cyclicVertices = null

    if (sourceVertexName === targetVertexName) {
      const cyclicVertexName = sourceVertexName,  ///
        cyclicVertex = this.getVertexByVertexName(cyclicVertexName)

      cyclicVertices = [cyclicVertex]
    } else {
      const sourceVertex = this.addVertexByVertexName(sourceVertexName),
        targetVertex = this.addVertexByVertexName(targetVertexName),
        edgePresent = sourceVertex.isEdgePresentByTargetVertex(targetVertex)

      if (!edgePresent) {
        const sourceVertexIndex = sourceVertex.getIndex(),
          targetVertexIndex = targetVertex.getIndex(),
          invalidatingEdge = (sourceVertexIndex > targetVertexIndex)

        if (invalidatingEdge) {
          cyclicVertices = this.validateEdgeByVertices(sourceVertex, targetVertex)
        }

        const cycleMissing = (cyclicVertices === null) ///

        if (cycleMissing) {
          const immediatePredecessorVertex = sourceVertex, ///
            immediateSuccessorVertex = targetVertex ///

          immediatePredecessorVertex.addImmediateSuccessorVertex(immediateSuccessorVertex)

          immediateSuccessorVertex.addImmediatePredecessorVertex(immediatePredecessorVertex)
        }
      }
    }

    const cyclicVertexNames = (cyclicVertices !== null) ?
      vertexNamesFromVertices(cyclicVertices) :
      null

    return cyclicVertexNames
  }

  removeVertexByVertexName(vertexName: string) {
    let removedEdges: Edge[] | null = null

    const vertexPresent = this.isVertexPresentByVertexName(vertexName)

    if (vertexPresent) {
      removedEdges = []

      const vertex = this.getVertexByVertexName(vertexName)

      vertex.immediateSuccessorVertices.forEach(function (immediateSuccessVertex) {
        const immediatePredecessorVertex = vertex,  ///
          immediatePredecessorVertexName = immediatePredecessorVertex.getName(),
          immediateSuccessVertexName = immediateSuccessVertex.getName(),
          removedEdgeSourceVertexName = immediatePredecessorVertexName, ///
          removedEdgeTargetVertexName = immediateSuccessVertexName, ///
          removedEdge = new Edge(removedEdgeSourceVertexName, removedEdgeTargetVertexName)

        removedEdges.push(removedEdge)

        immediateSuccessVertex.removeImmediatePredecessorVertex(immediatePredecessorVertex)
      })

      vertex.immediatePredecessorVertices.forEach(function (immediatePredecessorVertex) {
        const immediateSuccessVertex = vertex,  ///
          immediatePredecessorVertexName = immediatePredecessorVertex.getName(),
          immediateSuccessVertexName = immediateSuccessVertex.getName(),  ///
          removedEdgeSourceVertexName = immediatePredecessorVertexName, ///
          removedEdgeTargetVertexName = immediateSuccessVertexName, ///
          removedEdge = new Edge(removedEdgeSourceVertexName, removedEdgeTargetVertexName)

        removedEdges.push(removedEdge)

        immediatePredecessorVertex.removeImmediateSuccessorVertex(immediateSuccessVertex)
      })

      this.unsetVertexByVertexName(vertexName)
    }

    return removedEdges
  }

  removeEdge(edge: Edge) {
    const sourceVertexName = edge.getSourceVertexName(),
      targetVertexName = edge.getTargetVertexName()

    this.removeEdgeByVertexNames(sourceVertexName, targetVertexName)
  }

  removeEdgeByVertexNames(sourceVertexName: string, targetVertexName: string) {
    const edgePresent = this.isEdgePresentByVertexNames(sourceVertexName, targetVertexName)

    if (edgePresent) {
      const sourceVertex = this.getVertexByVertexName(sourceVertexName),
        targetVertex = this.getVertexByVertexName(targetVertexName)

      sourceVertex.removeImmediateSuccessorVertex(targetVertex)
      targetVertex.removeImmediatePredecessorVertex(sourceVertex)
    }
  }

  removeEdgesBySourceVertexName(sourceVertexName: string) {
    const sourceVertexPresent = this.isVertexPresentByVertexName(sourceVertexName)

    if (sourceVertexPresent) {
      const sourceVertex = this.getVertexByVertexName(sourceVertexName)

      sourceVertex.removeOutgoingEdges()
    }
  }

  removeEdgesByTargetVertexName(targetVertexName: string) {
    const targetVertexPresent = this.isVertexPresentByVertexName(targetVertexName)

    if (targetVertexPresent) {
      const targetVertex = this.getVertexByVertexName(targetVertexName)

      targetVertex.removeIncomingEdges()
    }
  }
  
  // 'last' method from package necessary
  // validateEdgeByVertices(sourceVertex: string, targetVertex: string) {
  //   let cyclicVertices = null

  //   const forwardsAffectedVertices = targetVertex.getForwardsAffectedVertices(sourceVertex),
  //     lastForwardsAffectedVertex = last(forwardsAffectedVertices),
  //     cyclePresent = (lastForwardsAffectedVertex === sourceVertex)

  //   if (cyclePresent) {
  //     cyclicVertices = forwardsAffectedVertices
  //   } else {
  //     const backwardsAffectedVertices = sourceVertex.getBackwardsAffectedVertices()

  //     topologicallyOrderVertices(backwardsAffectedVertices)

  //     topologicallyOrderVertices(forwardsAffectedVertices)

  //     const affectedVertices = [].concat(backwardsAffectedVertices).concat(forwardsAffectedVertices),
  //       affectedVertexIndices = affectedVertices.map(function (affectedVertex) {
  //         const affectedVertexIndex = affectedVertex.getIndex()

  //         return affectedVertexIndex
  //       })

  //     affectedVertexIndices.sort()

  //     affectedVertices.forEach(function (affectedVertex, index) {
  //       const affectedVertexIndex = affectedVertexIndices[index]

  //       affectedVertex.setIndex(affectedVertexIndex)
  //     })
  //   }

  //   return cyclicVertices
  // }

  static fromNothing() {
    const vertexMap = {},
      directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)

    return directedAcyclicGraph
  }

  static fromVertexNames(vertexNames: string[]) {
    const vertexMap = vertexMapFromVertexNames(vertexNames)

    const directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)

    return directedAcyclicGraph
  }

  // not sure about topologicallyOrderedVertices type
  static fromTopologicallyOrderedVertices(topologicallyOrderedVertices: Vertex[]) {
    const vertexMap = vertexMapFromTopologicallyOrderedVertices(topologicallyOrderedVertices)

    addEdgesToVertices(topologicallyOrderedVertices, vertexMap)

    const directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)

    return directedAcyclicGraph
  }
}

function vertexMapFromVertexNames(vertexNames: string[]) {
  const vertexMap = {}

  vertexNames.forEach(function (vertexName, index) {
    const name = vertexName,  ///
      vertex = Vertex.fromNameAndIndex(name, index)

    vertexMap[vertexName] = vertex
  })

  return vertexMap
}

// type of argument
const vertexMapFromTopologicallyOrderedVertices = (topologicallyOrderedVertices: Vertex[]) => {
  const vertexMap = {}

  topologicallyOrderedVertices.forEach(function (topologicallyOrderedVertex, index) {
    const name = topologicallyOrderedVertex.getName(),
      vertex = Vertex.fromNameAndIndex(name, index),
      vertexName = name  ///

    vertexMap[vertexName] = vertex
  })

  return vertexMap
}

// const addEdgesToVertices = (topologicallyOrderedVertices: Vertex[], vertexMap: IVertexMap) => {
//   topologicallyOrderedVertices.forEach(function (topologicallyOrderedVertex) {
//     topologicallyOrderedVertex.forEachOutgoingEdge(function (outgoingEdge: Edge) {
//       const sourceVertexName = outgoingEdge.getSourceVertexName(),
//         targetVertexName = outgoingEdge.getTargetVertexName(),
//         immediatePredecessorVertexName = sourceVertexName,  ///
//         immediateSuccessorVertexName = targetVertexName,
//         immediatePredecessorVertex = vertexMap[immediatePredecessorVertexName], ///
//         immediateSuccessorVertex = vertexMap[immediateSuccessorVertexName] ///

//       immediatePredecessorVertex.addImmediateSuccessorVertex(immediateSuccessorVertex)

//       immediateSuccessorVertex.addImmediatePredecessorVertex(immediatePredecessorVertex)
//     })
//   })
// }

