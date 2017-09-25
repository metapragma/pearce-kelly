'use strict'

export const vertexNamesFromVertices = (vertices: Vertex[]) => {
  const vertexNames = vertices.map((vertex) => {
    const vertexName = vertex.getName()

    return vertexName
  })

  return vertexNames
}

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

export interface IVertexMap {
  [key: string]: Vertex
}

export class Vertex {
  static fromNameAndIndex(name: string, index: number): Vertex {
    const immediatePredecessorVertices: Vertex[] = []
    const immediateSuccessorVertices: Vertex[] = []
    const dependencyVertex = new Vertex(name, index, false, immediatePredecessorVertices, immediateSuccessorVertices)
    return dependencyVertex
  }
  
  name: string
  index: number
  visited: boolean
  immediatePredecessorVertices: Vertex[]
  immediateSuccessorVertices: Vertex[]

  constructor(name: string, index: number, visited: boolean, immediatePredecessorVertices: Vertex[], immediateSuccessorVertices: Vertex[]) {
    this.name = name
    this.index = index
    this.visited = visited
    this.immediatePredecessorVertices = immediatePredecessorVertices
    this.immediateSuccessorVertices = immediateSuccessorVertices
  }

  getName(): string {
    return this.name
  }

  getIndex(): number  {
    return this.index
  }

  isVisited(): boolean {
    return this.visited
  }

  getImmediatePredecessorVertices(): Vertex[] {
    return this.immediatePredecessorVertices
  }

  getImmediateSuccessorVertices(): Vertex[] {
    return this.immediateSuccessorVertices
  }

  // check this
  getPredecessorVertexMap(predecessorVertexMap: IVertexMap = {}) {
    this.immediatePredecessorVertices.forEach((vertex: Vertex) => {
      const predecessorVertexName = vertex.getName()
      predecessorVertexMap[predecessorVertexName] = vertex

      // predecessorVertex.getPredecessorVertices(predecessorVertexMap)
    })

    return predecessorVertexMap
  }

  getSuccessorVertexMap(successorVertexMap: IVertexMap = {}) {
    this.immediateSuccessorVertices.forEach((vertex: Vertex) => {
      const successorVertexName = vertex.getName()
      successorVertexMap[successorVertexName] = vertex

      // successorVertex.getSuccessorVertices(successorVertexMap)
    })

    return successorVertexMap
  }
  
  getPredecessorVertexNames() {
    let predecessorVertexNames: string[] = []
    this.immediatePredecessorVertices.forEach((vertex) => {
      predecessorVertexNames.push(vertex.getName())
    })
    return predecessorVertexNames
  }

  getSuccessorVertexNames() {
    let successorVertexNames: string[] = []
    this.immediateSuccessorVertices.forEach((vertex) => {
      successorVertexNames.push(vertex.getName())
    })
    return successorVertexNames
  }

  getPredecessorVertices() {
    const predecessorVertexMap = this.getPredecessorVertexMap()
    return Object.keys(predecessorVertexMap).map((vertexName) => predecessorVertexMap[vertexName])
  }

  getSuccessorVertices() {
    const successorVertexMap = this.getSuccessorVertexMap()
    return Object.keys(successorVertexMap).map((vertexName) => successorVertexMap[vertexName])
  }

  getTopologicallyOrderedPredecessorVertexNames() {
    return vertexNamesFromVertices(topologicallyOrderVertices(this.getPredecessorVertices()))
  }
  
  getForwardsAffectedVertices(sourceVertex) {
    const forwardsAffectedVertices = []

    this.forwardsDepthFirstSearch((visitedVertex) => {
      const forwardsAffectedVertex = visitedVertex  
      const terminate = (forwardsAffectedVertex === sourceVertex)  

      forwardsAffectedVertices.push(forwardsAffectedVertex)

      return terminate
    })

    forwardsAffectedVertices.forEach((forwardsAffectedVertex) => {
      forwardsAffectedVertex.resetVisited()
    })

    return forwardsAffectedVertices
  }

  getBackwardsAffectedVertices() {
    const backwardsAffectedVertices = []

    this.backwardsDepthFirstSearch((visitedVertex) => {
      const backwardsAffectedVertex = visitedVertex  

      backwardsAffectedVertices.push(backwardsAffectedVertex)
    })

    backwardsAffectedVertices.forEach((backwardsAffectedVertex) => {
      backwardsAffectedVertex.resetVisited()
    })

    return backwardsAffectedVertices
  }
  
  isVertexImmediatePredecessorVertex(vertex: Vertex) {
    return this.immediatePredecessorVertices.includes(vertex)
  }

  isVertexImmediateSuccessorVertex(vertex: Vertex) {
    return this.immediateSuccessorVertices.includes(vertex)
  }

  isEdgePresentBySourceVertex(sourceVertex: Vertex) {
    return this.isVertexImmediatePredecessorVertex(sourceVertex)
  }

  isEdgePresentByTargetVertex(targetVertex: Vertex) {
    return this.isVertexImmediateSuccessorVertex(targetVertex)
  }

  setName(name: string) {
    this.name = name
  }

  setIndex(index: number) {
    this.index = index
  }

  setVisited(visited: boolean) {
    this.visited = visited
  }

  removeImmediatePredecessorVertex(vertex: Vertex) {
    const index = this.immediatePredecessorVertices.indexOf(vertex)
    this.immediatePredecessorVertices.splice(index, 1)
  }

  removeImmediateSuccessorVertex(immediateSuccessorVertex: Vertex) {
    const index = this.immediateSuccessorVertices.indexOf(immediateSuccessorVertex)
    this.immediateSuccessorVertices.splice(index, 1)
  }
  
  // TODO: solve circular reference
  removeIncomingEdges() {
    const immediateSuccessorVertex = this 
    
    // this.immediatePredecessorVertices.forEach(function(immediatePredecessorVertex) {
    //   immediatePredecessorVertex.removeImmediateSuccessorVertex(immediateSuccessorVertex)
    // })

    this.immediatePredecessorVertices = []
  }

  removeOutgoingEdges() {
    const immediatePredecessorVertex = this 

    // this.immediateSuccessorVertices.forEach(function(immediateSuccessorVertex) {
    //   immediateSuccessorVertex.removeImmediateSuccessorVertex(immediatePredecessorVertex)
    // })

    this.immediateSuccessorVertices = []
  }

  resetVisited() {
    this.visited = false
  }

  addImmediatePredecessorVertex(vertex: Vertex) {
    this.immediatePredecessorVertices.push(vertex)
  }

  addImmediateSuccessorVertex(vertex: Vertex) {
    this.immediateSuccessorVertices.push(vertex)
  }
  
  forwardsDepthFirstSearch(callback) {
    let terminate = false

    if (this.visited === false) {
      this.visited = true

      const visitedVertex = this  

      terminate = callback(visitedVertex)

      if (terminate !== true) {
        this.immediateSuccessorVertices.some((immediateSuccessorVertex) => {
          terminate = immediateSuccessorVertex.forwardsDepthFirstSearch(callback)

          return terminate
        })
      }
    }

    return terminate
  }

  backwardsDepthFirstSearch(callback) {
    let terminate = false

    if (this.visited === false) {
      this.visited = true

      const visitedVertex = this  

      terminate = callback(visitedVertex)

      if (terminate !== true) {
        this.immediatePredecessorVertices.some((immediatePredecessorVertex) => {
          terminate = immediatePredecessorVertex.backwardsDepthFirstSearch(callback)

          return terminate
        })
      }
    }

    return terminate
  }
}

// add private, public
// getter/setter
