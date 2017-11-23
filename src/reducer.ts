import {
  IState,
  ISetVertexByVertexName,
  IUnsetVertexByVertexName,
  ISetVertexName,
  ISetVertexIndex,
  ISetVertexVisited,
  IRemoveImmediatePredecessorVertex,
  IAddImmediatePredecessorVertex,
  IRemoveImmediateSuccessorVertex,
  IAddImmediateSuccessorVertex,
  IResetVisited,
  IRemoveAllImmediatePredecessorVertices,
  IRemoveAllImmediateSuccessorVertices,
  IAppendVertexToState
} from './types'

export type IAction = ISetVertexByVertexName | IUnsetVertexByVertexName |
  ISetVertexName | ISetVertexIndex | ISetVertexVisited |
  IRemoveImmediatePredecessorVertex |
  IRemoveImmediateSuccessorVertex | IAddImmediatePredecessorVertex |
  IAddImmediateSuccessorVertex | IResetVisited |
  IRemoveAllImmediatePredecessorVertices | IRemoveAllImmediateSuccessorVertices |
  IAppendVertexToState

export const reducer = (state: IState = { vertexMap: {} }, action: IAction): IState => {
  switch (action.type) {
    case 'APPEND_VERTEX_TO_STATE':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertex.name]: action.payload.vertex
        }
      }
    case 'SET_VERTEX_NAME':
      // this is done directly instead of returning new state
      let swap = state.vertexMap[action.payload.currentName]
      delete state.vertexMap[action.payload.currentName]
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.newName]: swap
        }
      }
    case 'SET_VERTEX_INDEX':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            index: action.payload.index
          }
        }
      }
    case 'SET_VERTEX_VISITED':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            visited: action.payload.visited
          }
        }
      }
    case 'REMOVE_IMMEDIATE_PREDECESSOR_VERTEX':
      const predecessorArrayToDiff = state.vertexMap[action.payload.vertexName].immediatePredecessorVertices
      const predecessorRemoveIndex = predecessorArrayToDiff.indexOf(action.payload.vertexToRemove)
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediatePredecessorVertices: [
              ...predecessorArrayToDiff.slice(0, predecessorRemoveIndex),
              ...predecessorArrayToDiff.slice(predecessorRemoveIndex + 1)
            ]
          }
        }
      }
    case 'REMOVE_IMMEDIATE_SUCCESSOR_VERTEX':
      const successorArrayToDiff = state.vertexMap[action.payload.vertexName].immediateSuccessorVertices
      const successorRemoveIndex = successorArrayToDiff.indexOf(action.payload.vertexToRemove)
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediateSuccessorVertices: [
              ...successorArrayToDiff.slice(0, successorRemoveIndex),
              ...successorArrayToDiff.slice(successorRemoveIndex + 1)
            ]
          }
        }
      }
    case 'ADD_IMMEDIATE_PREDECESSOR_VERTEX':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediatePredecessorVertices: [
              ...state.vertexMap[action.payload.vertexName].immediatePredecessorVertices,
              action.payload.vertexToAdd
            ]
          }
        }
      }
    case 'ADD_IMMEDIATE_SUCCESSOR_VERTEX':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediateSuccessorVertices: [
              ...state.vertexMap[action.payload.vertexName].immediateSuccessorVertices,
              action.payload.vertexToAdd
            ]
          }
        }
      }
    case 'RESET_VISITED':
      // console.log(state.vertexMap[action.payload.vertexName])
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            visited: false
          }
        }
      }
    case 'REMOVE_ALL_IMMEDIATE_PREDECESSOR_VERTICES':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediatePredecessorVertices: []
          }
        }
      }
    case 'REMOVE_ALL_IMMEDIATE_SUCCESSOR_VERTICES':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: {
            ...state.vertexMap[action.payload.vertexName],
            immediateSuccessorVertices: []
          }
        }
      }
    case 'SET_VERTEX_BY_VERTEX_NAME':
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          [action.payload.vertexName]: action.payload.vertex
        }
      }
    case 'UNSET_VERTEX_BY_VERTEX_NAME':
     let modified = state.vertexMap
     delete modified[action.payload.vertexName]
      return {
        ...state,
        vertexMap: {
          ...state.vertexMap,
          ...modified
        }
      }
    default:
      return state
  }
}