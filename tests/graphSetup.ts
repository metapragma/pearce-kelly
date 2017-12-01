import { createStore, applyMiddleware, Store } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk'

import { IState } from '../types'
import { reducer } from '../src/reducer'
import {
  createVertex,
  addImmediatePredecessorVertex,
  addImmediateSuccessorVertex,
  removeVertexByVertexName
} from '../src/actions'
import {
  getVertexNames
} from '../src/selectors'

let store = createStore(reducer, applyMiddleware(thunk)) 

const graphSetup = (graphStore: Store<IState>) => {
  graphStore.dispatch(createVertex('v1', 1, false, [], []))
  graphStore.dispatch(createVertex('v2', 2, false, [], []))
  graphStore.dispatch(createVertex('v3', 3, false, [], []))
  graphStore.dispatch(createVertex('v4', 4, false, [], []))
  graphStore.dispatch(createVertex('v5', 5, false, [], []))
  graphStore.dispatch(createVertex('v6', 6, false, [], []))
  graphStore.dispatch(createVertex('v7', 7, false, [], []))
  graphStore.dispatch(createVertex('v8', 8, false, [], []))
  graphStore.dispatch(createVertex('v9', 9, false, [], []))
  graphStore.dispatch(addImmediatePredecessorVertex('v1', 'v2'))
  graphStore.dispatch(addImmediatePredecessorVertex('v1', 'v3'))
  graphStore.dispatch(addImmediatePredecessorVertex('v1', 'v4'))
  graphStore.dispatch(addImmediatePredecessorVertex('v1', 'v5'))
  graphStore.dispatch(addImmediateSuccessorVertex('v1', 'v6'))
  graphStore.dispatch(addImmediateSuccessorVertex('v1', 'v7'))
  graphStore.dispatch(addImmediateSuccessorVertex('v1', 'v8'))
  graphStore.dispatch(addImmediateSuccessorVertex('v1', 'v9'))
  graphStore.dispatch(addImmediateSuccessorVertex('v2', 'v6'))
  graphStore.dispatch(addImmediateSuccessorVertex('v5', 'v9'))
}

graphSetup(store)

const removeNodes = (store: Store<IState>) => {
  const vertexNames = getVertexNames(store.getState())
  for (let i = 0, l = vertexNames.length; i < l; i += 1) {
    store.dispatch(removeVertexByVertexName(vertexNames[i]))
  }
}

export { store, removeNodes }