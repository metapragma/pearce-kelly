'use strict'

import { Vertex } from '../vertex'
import Edge from '../edge'
import DirectedAcyclicGraph from '../directedAcyclicGraph'

import mocha = require('mocha')
import expect = require('expect')

describe("Vertex", () => {
  it("gets its name", () => {
    const vertex = new Vertex('vertex', 1, false, [], [])
    expect(vertex.getName()).toEqual('vertex')
  })

  it("gets its index", () => {
    const vertex = new Vertex('vertex', 1, false, [], [])
    expect(vertex.getIndex()).toEqual(1)
  })

  it("checks whether it's visited", () => {
    const vertex = new Vertex('vertex', 1, false, [], [])
    expect(vertex.isVisited()).toBe(false)
  })

  it("sets its name", () => {
    const vertex = new Vertex('vertex', 1, false, [], [])
    expect(vertex.getName()).toEqual('vertex')
    vertex.setName('newName')
    expect(vertex.getName()).toEqual('newName')  
  })

  it("sets its index", () => {
    const vertex = new Vertex('vertex', 1, false, [], [])
    expect(vertex.getIndex()).toEqual(1)
    vertex.setIndex(2)
    expect(vertex.getIndex()).toEqual(2)  
  })

  it("sets its 'visited' property", () => {
    const vertex = new Vertex('vertex', 1, false, [], [])
    expect(vertex.isVisited()).toBe(false)
    vertex.setVisited(true)
    expect(vertex.isVisited()).toBe(true)  
  })

  it("resets its 'visited' property to false", () => {
    const vertex = new Vertex('vertex', 1, true, [], [])
    expect(vertex.isVisited()).toBe(true)
    vertex.setVisited(false)
    expect(vertex.isVisited()).toBe(false)  
  })

  it("checks immediate predessecor vertices", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [])
    expect(vertex.getImmediatePredecessorVertices()).toEqual([v2, v3])
  })

  it("checks immediate successor vertices", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [], [v2, v3])
    expect(vertex.getImmediateSuccessorVertices()).toEqual([v2, v3])
  })

  it("gets predecessor vertex map", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    expect(vertex.getPredecessorVertexMap()).toEqual( { v2: v2, v3: v3 })
  })

  it("gets successor vertex map", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    expect(vertex.getSuccessorVertexMap()).toEqual( { v4: v4, v5: v5 })
  })

  it("gets predessecor vertex names", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    expect(vertex.getPredecessorVertexNames()).toEqual(['v2', 'v3'])
  })

  it("gets successor vertex names", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    expect(vertex.getSuccessorVertexNames()).toEqual(['v4', 'v5'])
  })

  it("gets predecessor vertices", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    expect(vertex.getPredecessorVertices()).toEqual([v2, v3])
  })

  it("gets successor vertices", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    expect(vertex.getSuccessorVertices()).toEqual([v4, v5])
  })

  it("gets topologically ordered predecessor vertex names", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v3, v2], [v4, v5])
    expect(vertex.getTopologicallyOrderedPredecessorVertexNames()).toEqual(['v2', 'v3'])
  })

  it("checks whether vertex is an immediate predecessor", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v3, v2], [v4, v5])
    expect(vertex.isVertexImmediatePredecessorVertex(v3)).toBe(true)
    expect(vertex.isVertexImmediatePredecessorVertex(v5)).toBe(false)
  })

  it("checks whether vertex is an immediate successor", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v3, v2], [v4, v5])
    expect(vertex.isVertexImmediateSuccessorVertex(v4)).toBe(true)
    expect(vertex.isVertexImmediateSuccessorVertex(v2)).toBe(false)
  })

  it("checks whether edge is present between itself and a source vertex (pointing to itself)", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v3, v2], [v4, v5])
    expect(vertex.isEdgePresentBySourceVertex(v2)).toBe(true)
    expect(vertex.isEdgePresentBySourceVertex(v4)).toBe(false)
  })

  it("checks whether edge is present between itself and a target vertex (pointing to target vertex)", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v3, v2], [v4, v5])
    expect(vertex.isEdgePresentByTargetVertex(v5)).toBe(true)
    expect(vertex.isEdgePresentByTargetVertex(v2)).toBe(false)
  })

  it("removes immediate predessecor vertex", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    vertex.removeImmediatePredecessorVertex(v3)
    expect(vertex.getPredecessorVertices()).toEqual([v2])
  })

  it("removes immediate successor vertex", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    vertex.removeImmediateSuccessorVertex(v4)
    expect(vertex.getSuccessorVertices()).toEqual([v5])
  })

  it("removes incoming edges", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    vertex.removeIncomingEdges()
    expect(vertex.getPredecessorVertices()).toEqual([])
  })

  it("removes outoging edges", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    vertex.removeOutgoingEdges()
    expect(vertex.getSuccessorVertices()).toEqual([])
  })

  it("adds immediate predecessor vertex", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2], [v4, v5])
    vertex.addImmediatePredecessorVertex(v3)
    expect(vertex.getPredecessorVertices()).toEqual([v2, v3])
  })

  it("adds immediate successor vertex", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4])
    vertex.addImmediateSuccessorVertex(v5)
    expect(vertex.getSuccessorVertices()).toEqual([v4, v5])
  })

  // DFS
  it("gets forward affected vertices", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    // expect(vertex.getForwardsAffectedVertices(vertex)).toEqual([v4, v5])
  })
})

describe("Edge", () => {
  it("gets its source vertex", () => {
    const v1 = new Vertex('v1', 1, false, [], [])
    const v2 = new Vertex('v2', 2, false, [], [])
    const edge = new Edge('v1', 'v2')
    expect(edge.getSourceVertexName()).toEqual('v1')
  })

  it("gets its target vertex", () => {
    const v1 = new Vertex('v1', 1, false, [], [])
    const v2 = new Vertex('v2', 2, false, [], [])
    const edge = new Edge('v1', 'v2')
    expect(edge.getTargetVertexName()).toEqual('v2')
  })
})

describe("Directed Acyclic Graph", () => {
  it("gets vertex values", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    const vertexMap = {
      'v2': v2,
      'v3': v3,
      'v4': v4,
      'v5': v5,
      'vertex': vertex
    }
    const dag = new DirectedAcyclicGraph(vertexMap)
    expect(dag.getVertexValues()).toEqual([v2, v3, v4, v5, vertex])
  })

  it("gets vertex names", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [v2, v3], [v4, v5])
    const vertexMap = {
      'v2': v2,
      'v3': v3,
      'v4': v4,
      'v5': v5,
      'vertex': vertex
    }
    const dag = new DirectedAcyclicGraph(vertexMap)
    expect(dag.getVertexNames()).toEqual(['v2', 'v3', 'v4', 'v5', 'vertex'])
  })

  it("gets topologically ordered vertex names", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const v4 = new Vertex('v4', 4, false, [], [])
    const v5 = new Vertex('v5', 5, false, [], [])
    const vertex = new Vertex('vertex', 1, false, [], [])
    const dag = DirectedAcyclicGraph.fromNothing()
    dag.addEdgeByVertexNames('vertex', 'v4')
    dag.addEdgeByVertexNames('vertex', 'v5')
    dag.addEdgeByVertexNames('v2', 'vertex')
    dag.addEdgeByVertexNames('v3', 'vertex')
    dag.addEdgeByVertexNames('v3', 'v2')
    expect(dag.getTopologicallyOrderedVertexNames()).toEqual(['v3', 'v2', 'vertex', 'v4', 'v5'])
  })

  // TODO: no idea why line 314 fails
  // it("gets vertex by vertex name", () => {
  //   const vertex = new Vertex('vertex', 1, false, [], [])
  //   const dag = DirectedAcyclicGraph.fromNothing()
  //   dag.addVertexByVertexName('vertex')
  //   expect(dag.getVertexByVertexName('v2')).toEqual(null)
  //   expect(dag.getVertexByVertexName('vertex')).toEqual(vertex)
  // })

  it("sets vertex by vertex name", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const dag = DirectedAcyclicGraph.fromNothing()
    dag.setVertexByVertexName('v2', v2)
    expect(dag.getVertexByVertexName('v2')).toEqual(v2)
  })

  it("unsets vertex by vertex name", () => {
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const dag = DirectedAcyclicGraph.fromNothing()
    dag.setVertexByVertexName('v2', v2)
    expect(dag.getVertexByVertexName('v2')).toEqual(v2)
    dag.unsetVertexByVertexName('v2')
    expect(dag.getVertexByVertexName('v2')).toEqual(null)
  })

  it("checks whether it's empty", () => {
    const dag = DirectedAcyclicGraph.fromNothing()
    expect(dag.isEmpty()).toBe(true)
    const v2 = new Vertex('v2', 2, false, [], [])
    dag.setVertexByVertexName('v2', v2)
    expect(dag.isEmpty()).toBe(false)
  })

  it("checks whether edge is present", () => {
    const dag = DirectedAcyclicGraph.fromNothing()
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const edge = new Edge('v2', 'v3')
    expect(dag.isEdgePresent(edge)).toBe(false)
    dag.addEdge(edge)
    expect(dag.isEdgePresent(edge)).toBe(true)
  })

  it("checks whether edge is present by vertex names", () => {
    const dag = DirectedAcyclicGraph.fromNothing()
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    const edge = new Edge('v2', 'v3')
    dag.addEdge(edge)
    expect(dag.isEdgePresentByVertexNames('v2', 'v3')).toBe(true)
  })

  it("checks whether vertex is present by vertex name", () => {
    const dag = DirectedAcyclicGraph.fromNothing()
    const v2 = new Vertex('v2', 2, false, [], [])
    expect(dag.isVertexPresentByVertexName('v2')).toBe(false)
    dag.addVertexByVertexName('v2')
    expect(dag.isVertexPresentByVertexName('v2')).toBe(true)
  })

  it("gets predecessor vertex names by vertex name", () => {
    const dag = DirectedAcyclicGraph.fromNothing()
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    dag.addEdgeByVertexNames('v3', 'v2')
    expect(dag.getPredecessorVertexNamesByVertexName('v2')).toEqual(['v3'])
  })

  it("gets successor vertex names by vertex name", () => {
    const dag = DirectedAcyclicGraph.fromNothing()
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    dag.addEdgeByVertexNames('v3', 'v2')
    expect(dag.getSuccessorVertexNamesByVertexName('v3')).toEqual(['v2'])
  })

  it("adds edge by vertex names", () => {
    const dag = DirectedAcyclicGraph.fromNothing()
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    expect(dag.isEdgePresentByVertexNames('v3', 'v2')).toBe(false)
    dag.addEdgeByVertexNames('v3', 'v2')
    expect(dag.isEdgePresentByVertexNames('v3', 'v2')).toBe(true)
  })

  it("removes edge by vertex names", () => {
    const dag = DirectedAcyclicGraph.fromNothing()
    const v2 = new Vertex('v2', 2, false, [], [])
    const v3 = new Vertex('v3', 3, false, [], [])
    expect(dag.isEdgePresentByVertexNames('v3', 'v2')).toBe(false)
    dag.addEdgeByVertexNames('v3', 'v2')
    expect(dag.isEdgePresentByVertexNames('v3', 'v2')).toBe(true)
    dag.removeEdgeByVertexNames('v3', 'v2')
    expect(dag.isEdgePresentByVertexNames('v3', 'v2')).toBe(false)
  })
})
