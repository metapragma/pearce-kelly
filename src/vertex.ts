'use strict'

// import { vertexNamesFromVertices, topologicallyOrderVertices } from './utilities/vertex' 

// determnine exact value type
// interface IVertexMap {
//   [key: string]: any
// }

export default class Vertex {
  name: string
  // do we need value here?
  value: any
  index: number
  visited: boolean
  immediatePredecessorVertices: Vertex[]
  immediateSuccessorVertices: Vertex[]
  // enforce predessors, succesors?
  constructor(name: string, value: any, index: number, visited: boolean, immediatePredecessorVertices?: Vertex[], immediateSuccessorVertices?: Vertex[]) {
    this.name = name
    this.value = value
    this.index = index
    this.visited = visited
    this.immediatePredecessorVertices = immediatePredecessorVertices
    this.immediateSuccessorVertices = immediateSuccessorVertices
  }

  getName(): string {
    return this.name
  }

  getValue(): any {
    return this.value
  }

  getIndex(): number {
    return this.index
  }

  isVisited(): boolean {
    return this.visited
  }

    setName(name: string): void {
    this.name = name
  }

  setValue(value: any): void {
    this.value = value
  }

  setIndex(index: number): void {
    this.index = index
  }

  setVisited(visited: boolean): void {
    this.visited = visited
  }

  resetVisited(): void {
    this.visited = false
  }

  getImmediatePredecessorVertices(): Vertex[] {
    return this.immediatePredecessorVertices
  }

  getImmediateSuccessorVertices(): Vertex[] {
    return this.immediateSuccessorVertices
  }

  // test this
  getPredecessorVertexMap(): object {
    let predecessorVertexMap: object = {}
    this.immediatePredecessorVertices.forEach((vertex) => {
      predecessorVertexMap[vertex.getName()] = vertex.getValue()
    })
    return predecessorVertexMap
    // this.forEachImmediatePredecessorVertex(function(immediatePredecessorVertex) {
    //   const predecessorVertex = immediatePredecessorVertex, ///
    //         predecessorVertexName = predecessorVertex.getName()

    //   predecessorVertexMap[predecessorVertexName] = predecessorVertex

    //   predecessorVertex.getPredecessorVertices(predecessorVertexMap)
    // })

    // return predecessorVertexMap
  }

  getSuccessorVertexMap(): object {
    let successorVertexMap: object = {}
    this.immediateSuccessorVertices.forEach((vertex) => {
      successorVertexMap[vertex.getName()] = vertex.getValue()
    })
    return successorVertexMap
    // this.forEachImmediateSuccessorVertex(function(immediateSuccessorVertex) {
    //   const successorVertex = immediateSuccessorVertex, ///
    //         successorVertexName = successorVertex.getName()

    //   successorVertexMap[successorVertexName] = successorVertex

    //   successorVertex.getSuccessorVertices(successorVertexMap)
    // })

    // return successorVertexMap
  }
  
  getPredecessorVertexNames(): string[] {
    let predecessorVertexNames: string[] = []
    this.immediatePredecessorVertices.forEach((vertex) => {
      predecessorVertexNames.push(vertex.getName())
    })
    return predecessorVertexNames
    // const predecessorVertices = this.getPredecessorVertices(),
    //       predecessorVertexNames = predecessorVertices.map(function(predecessorVertex) {
    //         const predecessorVertexName = predecessorVertex.getName()
            
    //         return predecessorVertexName
    //       })
    
    // return predecessorVertexNames
  }

  getSuccessorVertexNames(): string[] {
    let successorVertexNames: string[] = []
    this.immediateSuccessorVertices.forEach((vertex) => {
      successorVertexNames.push(vertex.getName())
    })
    return successorVertexNames
    // const successorVertices = this.getSuccessorVertices(),
    //       successorVertexNames = successorVertices.map(function(successorVertex) {
    //       const successorVertexName = successorVertex.getName()

    //       return successorVertexName
    //     })

    // return successorVertexNames
  }

  getPredecessorVertexValues(): any[] {
    let predecessorVertexValues: any[] = []
    this.immediatePredecessorVertices.forEach((vertex) => {
      predecessorVertexValues.push(vertex.getValue())
    })
    return predecessorVertexValues
    // const predecessorVertexMap = this.getPredecessorVertexMap(),
    //       predecessorVertexNames = Object.keys(predecessorVertexMap),
    //       predecessorVertices = predecessorVertexNames.map(function(predecessorVertexName) {
    //         const predecessorVertex = predecessorVertexMap[predecessorVertexName]

    //         return predecessorVertex
    //       })

    // return predecessorVertices
  }

  getSuccessorVertexValues(): any[] {
    let successorVertexValues: any[] = []
    this.immediateSuccessorVertices.forEach((vertex) => {
      successorVertexValues.push(vertex.getValue())
    })
    return successorVertexValues
    // const successorVertexMap = this.getSuccessorVertexMap(),
    //       successorVertexNames = Object.keys(successorVertexMap),
    //       successorVertices = successorVertexNames.map(function(successorVertexName) {
    //         const successorVertex = successorVertexMap[successorVertexName]
  
    //         return successorVertex
    //       })

    // return successorVertices
  }

  // getTopologicallyOrderedPredecessorVertexNames() {
  //   const predecessorVertices = this.getPredecessorVertices()

  //   topologicallyOrderVertices(predecessorVertices)

  //   const topologicallyOrderedPredecessorVertices = predecessorVertices,  ///
  //         topologicallyOrderedPredecessorVertexNames = vertexNamesFromVertices(topologicallyOrderedPredecessorVertices)

  //   return topologicallyOrderedPredecessorVertexNames
  // }

  forwardsDepthFirstSearch(callback: (visitedVertex: Vertex) => boolean): boolean {
    // start DFS on successor vertices
    let terminate = false
    // if successor node is not visited yet
    if (this.visited === false) {
      // set visited to true
      this.visited = true
      // afterwards this refers to successor node
      const visitedVertex = this
      // perform the callback which will return true or false
      terminate = callback(visitedVertex)
      // if true, return true and halt
      // if false, successor node itself has successor nodes
      if (terminate !== true) {
        // perform DFS on some successor node of current successor node
        this.immediateSuccessorVertices.some((vertex) => {
          terminate = vertex.forwardsDepthFirstSearch(callback)
          // do this recursively until terminate returns true
          return terminate
        })
      }
    }

    return terminate
  }

  backwardsDepthFirstSearch(callback: (visitedVertex: Vertex) => boolean): boolean {
    let terminate = false

    if (this.visited === false) {
      this.visited = true

      const visitedVertex = this

      terminate = callback(visitedVertex)

      if (terminate !== true) {
          this.immediatePredecessorVertices.some(function(immediatePredecessorVertex) {
          terminate = immediatePredecessorVertex.backwardsDepthFirstSearch(callback)

          return terminate
        })
      }
    }

    return terminate
  }
  
  // understand how this works
  getForwardsAffectedVertices(sourceVertex: Vertex): Vertex[] {
    const forwardsAffectedVertices: Vertex[] = []

    this.forwardsDepthFirstSearch(function(visitedVertex) {
      const forwardsAffectedVertex = visitedVertex,  
            terminate = (forwardsAffectedVertex === sourceVertex)  

      forwardsAffectedVertices.push(forwardsAffectedVertex)

      return terminate
    })

    forwardsAffectedVertices.forEach(function(forwardsAffectedVertex) {
      forwardsAffectedVertex.resetVisited()
    })

    return forwardsAffectedVertices
  }

  getBackwardsAffectedVertices(sourceVertex: Vertex): Vertex[] {
    const backwardsAffectedVertices: Vertex[] = []

    this.backwardsDepthFirstSearch((visitedVertex) => {
      const backwardsAffectedVertex = visitedVertex, 
              terminate = (backwardsAffectedVertex === sourceVertex)

      backwardsAffectedVertices.push(backwardsAffectedVertex)

      return terminate
    })

    backwardsAffectedVertices.forEach(function(backwardsAffectedVertex) {
      backwardsAffectedVertex.resetVisited()
    })

    return backwardsAffectedVertices
  }
  
  isVertexImmediatePredecessorVertex(vertex: Vertex): boolean {
    return this.immediatePredecessorVertices.includes(vertex)
  }

  isVertexImmediateSuccessorVertex(vertex: Vertex): boolean {
    return this.immediateSuccessorVertices.includes(vertex)
  }

  isEdgePresentBySourceVertex(vertex: Vertex): boolean {
    return this.isVertexImmediatePredecessorVertex(vertex)
  }

  isEdgePresentByTargetVertex(vertex: Vertex): boolean {
    return this.isVertexImmediateSuccessorVertex(vertex)
  }

  addImmediatePredecessorVertex(vertex: Vertex): void {
    this.immediatePredecessorVertices.push(vertex)
  }

  addImmediateSuccessorVertex(vertex: Vertex): void {
    this.immediateSuccessorVertices.push(vertex)
  }

  removeImmediatePredecessorVertex(vertex: Vertex): void {
    const index = this.immediatePredecessorVertices.indexOf(vertex)
    this.immediatePredecessorVertices.splice(index, 1)
  }

  removeImmediateSuccessorVertex(immediateSuccessorVertex: Vertex): void {
    const index = this.immediateSuccessorVertices.indexOf(immediateSuccessorVertex)
    this.immediateSuccessorVertices.splice(index, 1)
  }
  
  removeIncomingEdges(): void {
    // remove current vertex from successors list of predecessor vertices
    const immediateSuccessorVertex = this
    // circular reference
    // this.immediatePredecessorVertices.forEach((vertex) => {
    //   vertex.removeImmediateSuccessorVertex(immediateSuccessorVertex)
    // })
    // remove predecessor vertices of current vertex
    this.immediatePredecessorVertices = []
  }

  removeOutgoingEdges() {
    // same logic on successors
    const immediatePredecessorVertex = this
    // circular reference problem
    // this.immediateSuccessorVertices.forEach((vertex) => {
    //   vertex.removeImmediateSuccessorVertex(immediatePredecessorVertex)
    // })
    this.immediateSuccessorVertices = []
  }

  static fromNameAndIndex(name: string, value: any, index: number) {
    const visited = false,
          immediatePredecessorVertices: Vertex[] = [],
          immediateSuccessorVertices: Vertex[] = [],
          dependencyVertex = new Vertex(name, value, index, visited, immediatePredecessorVertices, immediateSuccessorVertices)

    return dependencyVertex
  }
}

////
// implement automatic predecessor and successor discovery (avoiding circular reference)

// let vertex = new Vertex()
// export default vertex