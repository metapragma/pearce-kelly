"use strict";
exports.__esModule = true;
var redux_1 = require("redux");
var redux_thunk_1 = require("redux-thunk");
var reducer_1 = require("../src/reducer");
var actions_1 = require("../src/actions");
var selectors_1 = require("../src/selectors");
var store = redux_1.createStore(reducer_1.reducer, redux_1.applyMiddleware(redux_thunk_1["default"]));
exports.store = store;
var graphSetup = function (graphStore) {
    graphStore.dispatch(actions_1.createVertex('v1', 1, false, [], []));
    graphStore.dispatch(actions_1.createVertex('v2', 2, false, [], []));
    graphStore.dispatch(actions_1.createVertex('v3', 3, false, [], []));
    graphStore.dispatch(actions_1.createVertex('v4', 4, false, [], []));
    graphStore.dispatch(actions_1.createVertex('v5', 5, false, [], []));
    graphStore.dispatch(actions_1.createVertex('v6', 6, false, [], []));
    graphStore.dispatch(actions_1.createVertex('v7', 7, false, [], []));
    graphStore.dispatch(actions_1.createVertex('v8', 8, false, [], []));
    graphStore.dispatch(actions_1.createVertex('v9', 9, false, [], []));
    graphStore.dispatch(actions_1.addImmediatePredecessorVertex('v1', 'v2'));
    graphStore.dispatch(actions_1.addImmediatePredecessorVertex('v1', 'v3'));
    graphStore.dispatch(actions_1.addImmediatePredecessorVertex('v1', 'v4'));
    graphStore.dispatch(actions_1.addImmediatePredecessorVertex('v1', 'v5'));
    graphStore.dispatch(actions_1.addImmediateSuccessorVertex('v1', 'v6'));
    graphStore.dispatch(actions_1.addImmediateSuccessorVertex('v1', 'v7'));
    graphStore.dispatch(actions_1.addImmediateSuccessorVertex('v1', 'v8'));
    graphStore.dispatch(actions_1.addImmediateSuccessorVertex('v1', 'v9'));
    graphStore.dispatch(actions_1.addImmediateSuccessorVertex('v2', 'v6'));
    graphStore.dispatch(actions_1.addImmediateSuccessorVertex('v5', 'v9'));
};
graphSetup(store);
var removeNodes = function (store) {
    var vertexNames = selectors_1.getVertexNames(store.getState());
    for (var i = 0, l = vertexNames.length; i < l; i += 1) {
        store.dispatch(actions_1.removeVertexByVertexName(vertexNames[i]));
    }
};
exports.removeNodes = removeNodes;
