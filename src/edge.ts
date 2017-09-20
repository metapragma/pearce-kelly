'use strict';

class Edge {
  sourceVertexName: string
  targetVertexName: string
  constructor(sourceVertexName: string, targetVertexName: string) {
    this.sourceVertexName = sourceVertexName;
    this.targetVertexName = targetVertexName;
  }
  
  getSourceVertexName(): string {
    return this.sourceVertexName;
  }
  
  getTargetVertexName(): string {
    return this.targetVertexName;
  }
  
  isEqualTo(edge: Edge) {
    return (this.sourceVertexName === edge.getSourceVertexName() && this.targetVertexName === edge.getTargetVertexName())
  }
}

const edge = new Edge()
export default edge