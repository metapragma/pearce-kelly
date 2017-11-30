export type Selector<S, R> = (state: S) => R

export interface IState {
  vertexMap: {
    [key: string]: IVertexState
  }
}

export interface IVertexState {
  name: string,
  index: number,
  visited: boolean,
  immediatePredecessorVertices: string[],
  immediateSuccessorVertices: string[]
}

export interface ISetVertexByVertexName {
  type: 'SET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName: string,
    vertex: IVertexState
  }
}

export interface IUnsetVertexByVertexName {
  type: 'UNSET_VERTEX_BY_VERTEX_NAME',
  payload: {
    vertexName: string
  }
}

export interface IRemoveImmediatePredecessorVertex {
  type: 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName: string,
    vertexToRemove: string
  }
}

export interface ISetVertexName {
  type: 'SET_VERTEX_NAME',
  payload: {
    currentName: string,
    newName: string
  }
}

export interface ISetVertexIndex {
  type: 'SET_VERTEX_INDEX',
  payload: {
    index: number,
    vertexName: string
  }
}

export interface ISetVertexVisited {
  type: 'SET_VERTEX_VISITED',
  payload: {
    vertexName: string
    visited: boolean,
  }
}

export interface IRemoveImmediatePredecessorVertex {
  type: 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName: string,
    vertexToRemove: string
  }
}

export interface IRemoveImmediateSuccessorVertex {
  type: 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName: string,
    vertexToRemove: string
  }
}

export interface IResetVisited {
  type: 'RESET_VISITED',
  payload: {
    vertexName: string
  }
}

export interface ISetVisitedTrue {
  type: 'RESET_VISITED',
  payload: {
    vertexName: string
  }
}

export interface IAddImmediatePredecessorVertex {
  type: 'ADD_IMMEDIATE_PREDECESSOR_VERTEX',
  payload: {
    vertexName: string
    vertexToAdd: string
  }
}

export interface IAddImmediateSuccessorVertex {
  type: 'ADD_IMMEDIATE_SUCCESSOR_VERTEX',
  payload: {
    vertexName: string
    vertexToAdd: string
  }
}

export interface IRemoveAllImmediatePredecessorVertices {
  type: 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES',
  payload: {
    vertexName: string
  }
}

export interface IRemoveAllImmediateSuccessorVertices {
  type: 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES',
  payload: {
    vertexName: string
  }
}

export interface IAppendVertexToState {
  type: 'APPEND_VERTEX_TO_STATE',
  payload: {
    vertex: IVertexState
  }
}