'use strict'

import Edge from './edge'
import { Vertex, IVertexMap, topologicallyOrderVertices, vertexNamesFromVertices } from './vertex'

export default class DirectedAcyclicGraph {
  vertexMap: IVertexMap
  constructor(vertexMap: IVertexMap) {
    this.vertexMap = vertexMap
  }

  getVertexValues(): Vertex[] {
    // workaround Object.values()
    return Object.keys(this.vertexMap).map(key => this.vertexMap[key])
  }

  getVertexNames(): string[] {
    return Object.keys(this.vertexMap)
  }

  getTopologicallyOrderedVertexNames() {
    return vertexNamesFromVertices(topologicallyOrderVertices(this.getVertexValues()))
  }

  // check return union type
  getVertexByVertexName(vertexName: string): Vertex | null {
    if (this.isVertexPresentByVertexName(vertexName) === true) {
      return this.vertexMap[vertexName]
    } else {
      return null
    }
  }

  setVertexByVertexName(vertexName: string, vertex: Vertex): void {
    this.vertexMap[vertexName] = vertex
  }

  unsetVertexByVertexName(vertexName: string): void {
    delete this.vertexMap[vertexName]
  }

  isEmpty(): boolean {
    return this.getVertexValues.length === 0
  }

  isEdgePresent(edge: Edge): boolean {
    return this.isEdgePresentByVertexNames(edge.getSourceVertexName(), edge.getTargetVertexName())
  }

  isEdgePresentByVertexNames(sourceVertexName: string, targetVertexName: string): boolean {
    let edgePresent = false

    const sourceVertex = this.getVertexByVertexName(sourceVertexName)
    const targetVertex = this.getVertexByVertexName(targetVertexName)
    const sourceVertexAndTargetVertexPresent = (this.getVertexByVertexName(sourceVertexName) !== null) && (this.getVertexByVertexName(targetVertexName) !== null)

    if (sourceVertexAndTargetVertexPresent) {
      edgePresent = (sourceVertex.isVertexImmediateSuccessorVertex(targetVertex) && targetVertex.isVertexImmediatePredecessorVertex(sourceVertex))
    }

    return edgePresent
  }

  isVertexPresentByVertexName(vertexName: string): boolean {
    return this.getVertexNames().includes(vertexName)
  }

  getPredecessorVertexNamesByVertexName(vertexName: string): string[] {
    return this.getVertexByVertexName(vertexName).getPredecessorVertexNames()
  }

  getSuccessorVertexNamesByVertexName(vertexName: string): string[] {
    return this.getVertexByVertexName(vertexName).getSuccessorVertexNames()
  }

  addVertexByVertexName(vertexName: string): Vertex {
    const vertexPresent = this.isVertexPresentByVertexName(vertexName)
    
    // create vertex
    if (!vertexPresent) {
      const vertex = Vertex.fromNameAndIndex(vertexName, this.getVertexNames().length)
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

  addEdgeByVertexNames(sourceVertexName: string, targetVertexName: string): string[] {
    let cyclicVertices = null
    // source and target are the same: cyclic
    if (sourceVertexName === targetVertexName) {
      cyclicVertices = [this.getVertexByVertexName(sourceVertexName)]
    } else {
      // create edge from vertices
      const sourceVertex = this.addVertexByVertexName(sourceVertexName)
      const targetVertex = this.addVertexByVertexName(targetVertexName)
      const edgePresent = sourceVertex.isEdgePresentByTargetVertex(targetVertex)

      if (!edgePresent) {
        const sourceVertexIndex = sourceVertex.getIndex()
        const targetVertexIndex = targetVertex.getIndex()
        const invalidateEdge = (sourceVertexIndex > targetVertexIndex)

        if (invalidateEdge) {
          cyclicVertices = this.validateEdgeByVertices(sourceVertex, targetVertex)
        }
        
        const cycleMissing = (cyclicVertices === null) ///

        if (cycleMissing) {
          sourceVertex.addImmediateSuccessorVertex(targetVertex)
          targetVertex.addImmediatePredecessorVertex(sourceVertex)
        }
      }
    }

    const cyclicVertexNames = (cyclicVertices !== null) ? vertexNamesFromVertices(cyclicVertices) : null

    return cyclicVertexNames
  }

  removeVertexByVertexName(vertexName: string) {
    let removedEdges: Edge[] | null = null

    const vertexPresent = this.isVertexPresentByVertexName(vertexName)

    if (vertexPresent) {
      removedEdges = []

      const vertex = this.getVertexByVertexName(vertexName)

      vertex.immediateSuccessorVertices.forEach((immediateSuccessorVertex) => {
        removedEdges.push(new Edge(vertex.getName(), immediateSuccessorVertex.getName()))
        immediateSuccessorVertex.removeImmediatePredecessorVertex(vertex)
      })

      vertex.immediatePredecessorVertices.forEach((immediatePredecessorVertex) => {
        removedEdges.push(new Edge(immediatePredecessorVertex.getName(), vertex.getName()))
        immediatePredecessorVertex.removeImmediateSuccessorVertex(vertex)
      })

      this.unsetVertexByVertexName(vertexName)
    }

    return removedEdges
  }

  removeEdge(edge: Edge): void {
    this.removeEdgeByVertexNames(edge.getSourceVertexName(), edge.getTargetVertexName())
  }

  removeEdgeByVertexNames(sourceVertexName: string, targetVertexName: string): void {
    const edgePresent = this.isEdgePresentByVertexNames(sourceVertexName, targetVertexName)
    if (edgePresent) {
      const sourceVertex = this.getVertexByVertexName(sourceVertexName)
      const targetVertex = this.getVertexByVertexName(targetVertexName)
      sourceVertex.removeImmediateSuccessorVertex(targetVertex)
      targetVertex.removeImmediatePredecessorVertex(sourceVertex)
    }
  }

  removeEdgesBySourceVertexName(sourceVertexName: string): void {
    const sourceVertexPresent = this.isVertexPresentByVertexName(sourceVertexName)

    if (sourceVertexPresent) {
      this.getVertexByVertexName(sourceVertexName).removeOutgoingEdges()
    }
  }

  removeEdgesByTargetVertexName(targetVertexName: string) {
    const targetVertexPresent = this.isVertexPresentByVertexName(targetVertexName)

    if (targetVertexPresent) {
      this.getVertexByVertexName(targetVertexName).removeIncomingEdges()
    }
  }
  
  // 'last' method from package necessary
  validateEdgeByVertices(sourceVertex: Vertex, targetVertex: Vertex) {
    let cyclicVertices = null

    const forwardsAffectedVertices = targetVertex.getForwardsAffectedVertices(sourceVertex)
    const lastForwardsAffectedVertex = forwardsAffectedVertices[forwardsAffectedVertices.length - 1]
    const cyclePresent = (lastForwardsAffectedVertex === sourceVertex)

    if (cyclePresent) {
      cyclicVertices = forwardsAffectedVertices
    } else {
      const backwardsAffectedVertices = sourceVertex.getBackwardsAffectedVertices()

      topologicallyOrderVertices(backwardsAffectedVertices)

      topologicallyOrderVertices(forwardsAffectedVertices)

      const affectedVertices = [].concat(backwardsAffectedVertices).concat(forwardsAffectedVertices),
        affectedVertexIndices = affectedVertices.map((affectedVertex) => {
          const affectedVertexIndex = affectedVertex.getIndex()

          return affectedVertexIndex
        })

      affectedVertexIndices.sort()

      affectedVertices.forEach((affectedVertex, index) => {
        const affectedVertexIndex = affectedVertexIndices[index]

        affectedVertex.setIndex(affectedVertexIndex)
      })
    }

    return cyclicVertices
  }

  static fromNothing(): DirectedAcyclicGraph {
    const vertexMap: IVertexMap = {}
    const directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)
    return directedAcyclicGraph
  }

  static fromVertexNames(vertexNames: string[]): DirectedAcyclicGraph {
    const vertexMap: IVertexMap = vertexMapFromVertexNames(vertexNames)
    const directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)
    return directedAcyclicGraph
  }

  static fromTopologicallyOrderedVertices(topologicallyOrderedVertices: Vertex[]): DirectedAcyclicGraph {
    const vertexMap: IVertexMap = vertexMapFromTopologicallyOrderedVertices(topologicallyOrderedVertices)

    addEdgesToVertices(topologicallyOrderedVertices, vertexMap)

    const directedAcyclicGraph = new DirectedAcyclicGraph(vertexMap)
    return directedAcyclicGraph
  }
}

const vertexMapFromVertexNames = (vertexNames: string[]): IVertexMap => {
  const vertexMap: IVertexMap = {}

  vertexNames.forEach((vertexName, index) => {
    const vertex = Vertex.fromNameAndIndex(vertexName, index)
    vertexMap[vertexName] = vertex
  })

  return vertexMap
}

const vertexMapFromTopologicallyOrderedVertices = (topologicallyOrderedVertices: Vertex[]): IVertexMap => {
  const vertexMap: IVertexMap = {}

  topologicallyOrderedVertices.forEach((topologicallyOrderedVertex, index) => {
    const name = topologicallyOrderedVertex.getName()
    const vertex = Vertex.fromNameAndIndex(name, index)
    const vertexName = name 

    vertexMap[vertexName] = vertex
  })

  return vertexMap
}

const addEdgesToVertices = (topologicallyOrderedVertices: Vertex[], vertexMap: IVertexMap): void => {
  topologicallyOrderedVertices.forEach((topologicallyOrderedVertex) => {
    topologicallyOrderedVertex.forEachOutgoingEdge((outgoingEdge: Edge) => {
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

