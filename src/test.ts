'use strict'

// import DirectedAcyclicGraph from './directedAcyclicGraph'

import Vertex from './vertex'
import mocha = require('mocha')
import expect = require('expect')

// describe("Topological Sorting", () => {
//   it("passes default test", () => {

//     const firstDAG = DirectedAcyclicGraph.fromNothing(),
//       vertexName = 'i',
//       sourceVertexName = 'j',
//       targetVertexName = 'k'

//     firstDAG.addVertexByVertexName(vertexName)
//     firstDAG.addEdgeByVertexNames(sourceVertexName, targetVertexName)
//     const topologicallyOrderedVertexNames = firstDAG.getTopologicallyOrderedVertexNames()
//     expect(topologicallyOrderedVertexNames).toEqual(['i', 'j', 'k'])
//   })
//   it("passes topolysis test", () => {

//     const secondDAG = DirectedAcyclicGraph.fromNothing(),
//       v1 = 'tie your shoes',
//       v2 = 'put on your shoes',
//       v3 = 'put on your shorts',
//       v4 = 'put on your jacket',
//       v5 = 'put on your shirtdescribe("Topological Sorting", () => {
//   it("passes default test", () => {

//     const firstDAG = DirectedAcyclicGraph.fromNothing(),
//       vertexName = 'i',
//       sourceVertexName = 'j',
//       targetVertexName = 'k'

//     firstDAG.addVertexByVertexName(vertexName)
//     firstDAG.addEdgeByVertexNames(sourceVertexName, targetVertexName)
//     const topologicallyOrderedVertexNames = firstDAG.getTopologicallyOrderedVertexNames()
//     expect(topologicallyOrderedVertexNames).toEqual(['i', 'j', 'k'])
//   })
//   it("passes topolysis test", () => {

//     const secondDAG = DirectedAcyclicGraph.fromNothing(),
//       v1 = 'tie your shoes',
//       v2 = 'put on your shoes',
//       v3 = 'put on your shorts',
//       v4 = 'put on your jacket',
//       v5 = 'put on your shirt'

//     secondDAG.addEdgeByVertexNames(v2, v1)
//     secondDAG.addEdgeByVertexNames(v3, v2)
//     secondDAG.addEdgeByVertexNames(v3, v4)
//     secondDAG.addEdgeByVertexNames(v5, v4)
//     const topologicallyOrderedVertexNames = secondDAG.getTopologicallyOrderedVertexNames()
//     expect(topologicallyOrderedVertexNames).toEqual(['put on your shorts', 'put on your shoes',
//                                                      'tie your shoes', 'put on your shirt', 'put on your jacket'])
//   })
// })'

//     secondDAG.addEdgeByVertexNames(v2, v1)
//     secondDAG.addEdgeByVertexNames(v3, v2)
//     secondDAG.addEdgeByVertexNames(v3, v4)
//     secondDAG.addEdgeByVertexNames(v5, v4)
//     const topologicallyOrderedVertexNames = secondDAG.getTopologicallyOrderedVertexNames()
//     expect(topologicallyOrderedVertexNames).toEqual(['put on your shorts', 'put on your shoes',
//                                                      'tie your shoes', 'put on your shirt', 'put on your jacket'])
//   })
// })

describe("Vertex", () => {
  it("passes simple test", () => {
    const vertex = new Vertex('v1', 1, 0, false, [new Vertex('v2', 2, 1, false)], [new Vertex('v3', 3, 2, false)])
    // console.log(vertex)
  })

  it("gets its name", () => {
    const vertex = new Vertex('v1', 1, 0, false)
    expect(vertex.getName()).toEqual('v1')
  })

  it("gets its value", () => {
    const vertex = new Vertex('v1', 1, 0, false)
    expect(vertex.getValue()).toEqual(1)
  })

  it("gets its index", () => {
    const vertex = new Vertex('v1', 1, 0, false)
    expect(vertex.getIndex()).toEqual(0)
  })

  it("gets whether it's visited", () => {
    const vertex = new Vertex('v1', 1, 0, false)
    expect(vertex.isVisited()).toBe(false)
    const anotherVertex = new Vertex('v1', 1, 0, true)
    expect(anotherVertex.isVisited()).toBe(true)
  })

  it("sets its name", () => {
    const vertex = new Vertex('v1', 1, 0, false)
    expect(vertex.getName()).toEqual('v1')
    vertex.setName('newName')
    expect(vertex.getName()).toEqual('newName')
  })

  it("sets its value", () => {
    const vertex = new Vertex('v1', 1, 0, false)
    expect(vertex.getValue()).toEqual(1)
    vertex.setValue(5)
    expect(vertex.getValue()).toEqual(5)
  })

  it("sets its index", () => {
    const vertex = new Vertex('v1', 1, 0, false)
    expect(vertex.getIndex()).toEqual(0)
    vertex.setIndex(14)
    expect(vertex.getIndex()).toEqual(14)
  })

  it("sets its visited value", () => {
    const vertex = new Vertex('v1', 1, 0, false)
    expect(vertex.isVisited()).toBe(false)
    vertex.setVisited(true)
    expect(vertex.isVisited()).toBe(true)
  })

  it("resets its visited value to false", () => {
    const vertex = new Vertex('v1', 1, 0, true)
    expect(vertex.isVisited()).toBe(true)
    vertex.resetVisited()
    expect(vertex.isVisited()).toBe(false)
  })

  it("gets immediate predecessor vertices", () => {
    const vertex = new Vertex('v1', 1, 0, false, [new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
    expect(vertex.getImmediatePredecessorVertices()).toEqual([new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
  })

  it("gets immediate successor vertices", () => {
    const vertex = new Vertex('v1', 1, 0, false, [], [new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
    expect(vertex.getImmediateSuccessorVertices()).toEqual([new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
  })

  it("gets predecessor vertex map", () => {
    const vertex = new Vertex('v1', 1, 0, false, [new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
    expect(vertex.getPredecessorVertexMap()).toEqual( { 'v2': 10, 'v3': 15, 'v4': 112 })
  })

  it("gets successor vertex map", () => {
    const vertex = new Vertex('v1', 1, 0, false, [], [new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
    expect(vertex.getSuccessorVertexMap()).toEqual( { 'v2': 10, 'v3': 15, 'v4': 112 })
  })

  it("gets predecessor vertex names", () => {
    const vertex = new Vertex('v1', 1, 0, false, [new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
    expect(vertex.getPredecessorVertexNames()).toEqual(['v2', 'v3', 'v4'])
  })

  it("gets successor vertex names", () => {
    const vertex = new Vertex('v1', 1, 0, false, [], [new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
    expect(vertex.getSuccessorVertexNames()).toEqual(['v2', 'v3', 'v4'])
  })

  it("gets predecessor vertex values", () => {
    const vertex = new Vertex('v1', 1, 0, false, [new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
    expect(vertex.getPredecessorVertexValues()).toEqual([10, 15, 112])
  })

  it("gets successor vertex values", () => {
    const vertex = new Vertex('v1', 1, 0, false, [], [new Vertex('v2', 10, 11, true), new Vertex('v3', 15, 12, true), new Vertex('v4', 112, 8, true)])
    expect(vertex.getSuccessorVertexValues()).toEqual([10, 15, 112])
  })
  
  it("determines whether given vertex is an immediate predecessor", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    expect(vertex.isVertexImmediatePredecessorVertex(v2)).toBe(true)
    expect(vertex.isVertexImmediatePredecessorVertex(v5)).toBe(false)
  })

  it("determines whether given vertex is an immediate successor", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const vertex = new Vertex('v1', 1, 0, false, [v5], [v2, v3, v4])
    expect(vertex.isVertexImmediateSuccessorVertex(v2)).toBe(true)
    expect(vertex.isVertexImmediateSuccessorVertex(v5)).toBe(false)
  })

  it("is given a source vertex and determines whether an edge exists between them", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    expect(vertex.isEdgePresentBySourceVertex(v2)).toBe(true)
    expect(vertex.isEdgePresentBySourceVertex(v5)).toBe(false)
  })

  it("is given a target vertex and determines whether an edge exists between them", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    expect(vertex.isEdgePresentByTargetVertex(v2)).toBe(false)
    expect(vertex.isEdgePresentByTargetVertex(v5)).toBe(true)
  })

  it("adds immediate predceessor vertex", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const v6 = new Vertex('v6', 200, 7, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    vertex.addImmediatePredecessorVertex(v6)
    expect(vertex.getImmediatePredecessorVertices()).toEqual([v2, v3, v4, v6])
  })

  it("adds immediate successor vertex", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const v6 = new Vertex('v6', 200, 7, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    vertex.addImmediateSuccessorVertex(v6)
    expect(vertex.getImmediateSuccessorVertices()).toEqual([v5, v6])
  })

  it("removes immediate predecessor vertex", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    vertex.removeImmediatePredecessorVertex(v2)
    expect(vertex.getImmediatePredecessorVertices()).toEqual([v3, v4])
  })

  it("removes immediate successor vertex", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    vertex.removeImmediateSuccessorVertex(v5)
    expect(vertex.getImmediateSuccessorVertices()).toEqual([])
  })
  
  // circular reference problem
  it("removes incoming edges", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    vertex.removeIncomingEdges()
    expect(vertex.getImmediatePredecessorVertices()).toEqual([])
  })

  // circular reference problem
  it("removes incoming edges", () => {
    const v2 = new Vertex('v2', 10, 11, true)
    const v3 = new Vertex('v3', 15, 12, true)
    const v4 = new Vertex('v4', 112, 8, true)
    const v5 = new Vertex('v5', 90, 3, false)
    const vertex = new Vertex('v1', 1, 0, false, [v2, v3, v4], [v5])
    vertex.removeOutgoingEdges()
    expect(vertex.getImmediateSuccessorVertices()).toEqual([])
  })
})
