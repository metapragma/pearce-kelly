'use strict'

// const necessary = require('necessary')

import Edge = require('./edge')
import Vertex = require('./vertex')
import vertexUtilities = require('./utilities/vertex')

const { vertexNamesFromVertices, topologicallyOrderVertices } = vertexUtilities

class DirectedAcyclicGraph {
  vertexMap: object
  constructor(vertexMap: object) {  
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
    const vertices = this.getVertexNames()

    topologicallyOrderVertices(vertices)
    
    const topologicallyOrderedVertices = vertices, ///
          topologicallyOrderedVertexNames = vertexNamesFromVertices(topologicallyOrderedVertices)
    
    return topologicallyOrderedVertexNames
  }

  // check return union type
  getVertexByVertexName(vertexName: string): string | null {
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

  isEdgePresent(edge) {
    const sourceVertexName = edge.getSourceVertexName(),
          targetVertexName = edge.getTargetVertexName(),
          edgePresent = this.isEdgePresentByVertexNames(sourceVertexName, targetVertexName)
    
    return edgePresent
  }

  isEdgePresentByVertexNames(sourceVertexName, targetVertexName) {
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

  getPredecessorVertexNamesByVertexName(vertexName) {
    const vertex = this.getVertexByVertexName(vertexName),
          predecessorVertexNames = vertex.getPredecessorVertexNames()

    return predecessorVertexNames
  }

  getSuccessorVertexNamesByVertexName(vertexName) {
    const vertex = this.getVertexByVertexName(vertexName),
          successorVertexNames = vertex.getSuccessorVertexNames()
    
    return successorVertexNames
  }

  addVertexByVertexName(vertexName) {
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

  addEdge(edge) {
    const sourceVertexName = edge.getSourceVertexName(),
          targetVertexName = edge.getTargetVertexName(),
          cyclicVertexNames = this.addEdgeByVertexNames(sourceVertexName, targetVertexName)

    return cyclicVertexNames
  }

  addEdgeByVertexNames(sourceVertexName, targetVertexName) {
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

  removeVertexByVertexName(vertexName) {
    let removedEdges = null

    const vertexPresent = this.isVertexPresentByVertexName(vertexName)

    if (vertexPresent) {
      removedEdges = []

      const vertex = this.getVertexByVertexName(vertexName)

      vertex.forEachImmediateSuccessorVertex(function(immediateSuccessVertex) {
        const immediatePredecessorVertex = vertex,  ///
              immediatePredecessorVertexName = immediatePredecessorVertex.getName(),
              immediateSuccessVertexName = immediateSuccessVertex.getName(),
              removedEdgeSourceVertexName = immediatePredecessorVertexName, ///
              removedEdgeTargetVertexName = immediateSuccessVertexName, ///
              removedEdge = new Edge(removedEdgeSourceVertexName, removedEdgeTargetVertexName)

        removedEdges.push(removedEdge)

        immediateSuccessVertex.removeImmediatePredecessorVertex(immediatePredecessorVertex)
      })

      vertex.forEachImmediatePredecessorVertex(function(immediatePredecessorVertex) {
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

  removeEdge(edge) {
    const sourceVertexName = edge.getSourceVertexName(),
          targetVertexName = edge.getTargetVertexName()

    this.removeEdgeByVertexNames(sourceVertexName, targetVertexName)
  }

  removeEdgeByVertexNames(sourceVertexName, targetVertexName) {
    const edgePresent = this.isEdgePresentByVertexNames(sourceVertexName, targetVertexName)

    if (edgePresent) {
      const sourceVertex = this.getVertexByVertexName(sourceVertexName),
            targetVertex = this.getVertexByVertexName(targetVertexName)

      sourceVertex.removeImmediateSuccessorVertex(targetVertex)
      targetVertex.removeImmediatePredecessorVertex(sourceVertex)
    }
  }

  removeEdgesBySourceVertexName(sourceVertexName) {
    const sourceVertexPresent = this.isVertexPresentByVertexName(sourceVertexName)

    if (sourceVertexPresent) {
      const sourceVertex = this.getVertexByVertexName(sourceVertexName)

      sourceVertex.removeOutgoingEdges()
    }
  }

  removeEdgesByTargetVertexName(targetVertexName) {
    const targetVertexPresent = this.isVertexPresentByVertexName(targetVertexName)

    if (targetVertexPresent) {
      const targetVertex = this.getVertexByVertexName(targetVertexName)

      targetVertex.removeIncomingEdges()
    }
  }

  validateEdgeByVertices(sourceVertex, targetVertex) {
    let cyclicVertices = null

    const forwardsAffectedVertices = targetVertex.getForwardsAffectedVertices(sourceVertex),
          lastForwardsAffectedVertex = last(forwardsAffectedVertices),
          cyclePresent = (lastForwardsAffectedVertex === sourceVertex)
    
    if (cyclePresent) {
      cyclicVertices = forwardsAffectedVertices
    } else {
      const backwardsAffectedVertices = sourceVertex.getBackwardsAffectedVertices()

      topologicallyOrderVertices(backwardsAffectedVertices)

      topologicallyOrderVertices(forwardsAffectedVertices)

      const affectedVertices = [].concat(backwardsAffectedVertices).concat(forwardsAffectedVertices),
            affectedVertexIndices = affectedVertices.map(function(affectedVertex) {
              const affectedVertexIndex = affectedVertex.getIndex()

              return affectedVertexIndex
            })

      affectedVertexIndices.sort()

      affectedVertices.forEach(function(affectedVertex, index) {
        const affectedVertexIndex = affectedVertexIndices[index]

        affectedVertex.setIndex(affectedVertexIndex)
      })
    }

    return cyclicVertices
  }

  static fromNothing() {
    const vertexMap = {},
          directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)

    return directedAcyclicGraph
  }
  
  static fromVertexNames(vertexNames) {
    const vertexMap = vertexMapFromVertexNames(vertexNames)

    const directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)

    return directedAcyclicGraph
  }

  static fromTopologicallyOrderedVertices(topologicallyOrderedVertices) {
    const vertexMap = vertexMapFromTopologicallyOrderedVertices(topologicallyOrderedVertices)
    
    addEdgesToVertices(topologicallyOrderedVertices, vertexMap)
    
    const directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)
    
    return directedAcyclicGraph
  }
}

function vertexMapFromVertexNames(vertexNames) {
  const vertexMap = {}
  
  vertexNames.forEach(function(vertexName, index) {
    const name = vertexName,  ///
          vertex = Vertex.fromNameAndIndex(name, index)

    vertexMap[vertexName] = vertex
  })
  
  return vertexMap
}

function vertexMapFromTopologicallyOrderedVertices(topologicallyOrderedVertices) {
  const vertexMap = {}
  
  topologicallyOrderedVertices.forEach(function(topologicallyOrderedVertex, index) {
    const name = topologicallyOrderedVertex.getName(),
          vertex = Vertex.fromNameAndIndex(name, index),
          vertexName = name  ///

    vertexMap[vertexName] = vertex
  })

  return vertexMap
}

function addEdgesToVertices(topologicallyOrderedVertices, vertexMap) {
  topologicallyOrderedVertices.forEach(function(topologicallyOrderedVertex) {
    topologicallyOrderedVertex.forEachOutgoingEdge(function(outgoingEdge) {
      const sourceVertexName = outgoingEdge.getSourceVertexName(),
            targetVertexName = outgoingEdge.getTargetVertexName(),
            immediatePredecessorVertexName = sourceVertexName,  ///
            immediateSuccessorVertexName = targetVertexName,
            immediatePredecessorVertex = vertexMap[immediatePredecessorVertexName], ///
            immediateSuccessorVertex = vertexMap[immediateSuccessorVertexName] ///

      immediatePredecessorVertex.addImmediateSuccessorVertex(immediateSuccessorVertex)

      immediateSuccessorVertex.addImmediatePredecessorVertex(immediatePredecessorVertex)
    })
  })
}

const DAG = new DirectedAcyclicGraph()
export default DAG
