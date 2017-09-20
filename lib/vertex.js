'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var vertexUtilities = require('./utilities/vertex');

var vertexNamesFromVertices = vertexUtilities.vertexNamesFromVertices,
    topologicallyOrderVertices = vertexUtilities.topologicallyOrderVertices;

var Vertex = function () {
  function Vertex(name, index, visited, immediatePredecessorVertices, immediateSuccessorVertices) {
    _classCallCheck(this, Vertex);

    this.name = name;
    this.index = index;
    this.visited = visited;
    this.immediatePredecessorVertices = immediatePredecessorVertices;
    this.immediateSuccessorVertices = immediateSuccessorVertices;
  }

  _createClass(Vertex, [{
    key: 'getName',
    value: function getName() {
      return this.name;
    }
  }, {
    key: 'getIndex',
    value: function getIndex() {
      return this.index;
    }
  }, {
    key: 'isVisited',
    value: function isVisited() {
      return this.visited;
    }
  }, {
    key: 'getImmediatePredecessorVertices',
    value: function getImmediatePredecessorVertices() {
      return this.immediatePredecessorVertices;
    }
  }, {
    key: 'getImmediateSuccessorVertices',
    value: function getImmediateSuccessorVertices() {
      return this.immediateSuccessorVertices;
    }
  }, {
    key: 'getPredecessorVertexMap',
    value: function getPredecessorVertexMap() {
      var predecessorVertexMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.forEachImmediatePredecessorVertex(function (immediatePredecessorVertex) {
        var predecessorVertex = immediatePredecessorVertex,
            ///
        predecessorVertexName = predecessorVertex.getName();

        predecessorVertexMap[predecessorVertexName] = predecessorVertex;

        predecessorVertex.getPredecessorVertices(predecessorVertexMap);
      });

      return predecessorVertexMap;
    }
  }, {
    key: 'getSuccessorVertexMap',
    value: function getSuccessorVertexMap() {
      var successorVertexMap = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.forEachImmediateSuccessorVertex(function (immediateSuccessorVertex) {
        var successorVertex = immediateSuccessorVertex,
            ///
        successorVertexName = successorVertex.getName();

        successorVertexMap[successorVertexName] = successorVertex;

        successorVertex.getSuccessorVertices(successorVertexMap);
      });

      return successorVertexMap;
    }
  }, {
    key: 'getPredecessorVertexNames',
    value: function getPredecessorVertexNames() {
      var predecessorVertices = this.getPredecessorVertices(),
          predecessorVertexNames = predecessorVertices.map(function (predecessorVertex) {
        var predecessorVertexName = predecessorVertex.getName();

        return predecessorVertexName;
      });

      return predecessorVertexNames;
    }
  }, {
    key: 'getSuccessorVertexNames',
    value: function getSuccessorVertexNames() {
      var successorVertices = this.getSuccessorVertices(),
          successorVertexNames = successorVertices.map(function (successorVertex) {
        var successorVertexName = successorVertex.getName();

        return successorVertexName;
      });

      return successorVertexNames;
    }
  }, {
    key: 'getPredecessorVertices',
    value: function getPredecessorVertices() {
      var predecessorVertexMap = this.getPredecessorVertexMap(),
          predecessorVertexNames = Object.keys(predecessorVertexMap),
          predecessorVertices = predecessorVertexNames.map(function (predecessorVertexName) {
        var predecessorVertex = predecessorVertexMap[predecessorVertexName];

        return predecessorVertex;
      });

      return predecessorVertices;
    }
  }, {
    key: 'getSuccessorVertices',
    value: function getSuccessorVertices() {
      var successorVertexMap = this.getSuccessorVertexMap(),
          successorVertexNames = Object.keys(successorVertexMap),
          successorVertices = successorVertexNames.map(function (successorVertexName) {
        var successorVertex = successorVertexMap[successorVertexName];

        return successorVertex;
      });

      return successorVertices;
    }
  }, {
    key: 'getTopologicallyOrderedPredecessorVertexNames',
    value: function getTopologicallyOrderedPredecessorVertexNames() {
      var predecessorVertices = this.getPredecessorVertices();

      topologicallyOrderVertices(predecessorVertices);

      var topologicallyOrderedPredecessorVertices = predecessorVertices,
          ///
      topologicallyOrderedPredecessorVertexNames = vertexNamesFromVertices(topologicallyOrderedPredecessorVertices);

      return topologicallyOrderedPredecessorVertexNames;
    }
  }, {
    key: 'getForwardsAffectedVertices',
    value: function getForwardsAffectedVertices(sourceVertex) {
      var forwardsAffectedVertices = [];

      this.forwardsDepthFirstSearch(function (visitedVertex) {
        var forwardsAffectedVertex = visitedVertex,
            ///
        terminate = forwardsAffectedVertex === sourceVertex; ///

        forwardsAffectedVertices.push(forwardsAffectedVertex);

        return terminate;
      });

      forwardsAffectedVertices.forEach(function (forwardsAffectedVertex) {
        forwardsAffectedVertex.resetVisited();
      });

      return forwardsAffectedVertices;
    }
  }, {
    key: 'getBackwardsAffectedVertices',
    value: function getBackwardsAffectedVertices() {
      var backwardsAffectedVertices = [];

      this.backwardsDepthFirstSearch(function (visitedVertex) {
        var backwardsAffectedVertex = visitedVertex; ///

        backwardsAffectedVertices.push(backwardsAffectedVertex);
      });

      backwardsAffectedVertices.forEach(function (backwardsAffectedVertex) {
        backwardsAffectedVertex.resetVisited();
      });

      return backwardsAffectedVertices;
    }
  }, {
    key: 'isVertexImmediatePredecessorVertex',
    value: function isVertexImmediatePredecessorVertex(vertex) {
      var vertexImmediatePredecessorVertex = this.immediatePredecessorVertices.includes(vertex);

      return vertexImmediatePredecessorVertex;
    }
  }, {
    key: 'isVertexImmediateSuccessorVertex',
    value: function isVertexImmediateSuccessorVertex(vertex) {
      var vertexImmediateSuccessorVertex = this.immediateSuccessorVertices.includes(vertex);

      return vertexImmediateSuccessorVertex;
    }
  }, {
    key: 'isEdgePresentBySourceVertex',
    value: function isEdgePresentBySourceVertex(sourceVertex) {
      var sourceVertexImmediatePredecessorVertex = this.isVertexImmediatePredecessorVertex(sourceVertex),
          edgePresent = sourceVertexImmediatePredecessorVertex; ///

      return edgePresent;
    }
  }, {
    key: 'isEdgePresentByTargetVertex',
    value: function isEdgePresentByTargetVertex(targetVertex) {
      var targetVertexImmediateSuccessorVertex = this.isVertexImmediateSuccessorVertex(targetVertex),
          edgePresent = targetVertexImmediateSuccessorVertex; ///

      return edgePresent;
    }
  }, {
    key: 'setName',
    value: function setName(name) {
      this.name = name;
    }
  }, {
    key: 'setIndex',
    value: function setIndex(index) {
      this.index = index;
    }
  }, {
    key: 'setVisited',
    value: function setVisited(visited) {
      this.visited = visited;
    }
  }, {
    key: 'removeImmediatePredecessorVertex',
    value: function removeImmediatePredecessorVertex(immediatePredecessorVertex) {
      var index = this.immediatePredecessorVertices.indexOf(immediatePredecessorVertex),
          start = index,
          ///
      deleteCount = 1;

      this.immediatePredecessorVertices.splice(start, deleteCount);
    }
  }, {
    key: 'removeImmediateSuccessorVertex',
    value: function removeImmediateSuccessorVertex(immediateSuccessorVertex) {
      var index = this.immediateSuccessorVertices.indexOf(immediateSuccessorVertex),
          start = index,
          ///
      deleteCount = 1;

      this.immediateSuccessorVertices.splice(start, deleteCount);
    }
  }, {
    key: 'removeIncomingEdges',
    value: function removeIncomingEdges() {
      var immediateSuccessorVertex = this; ///

      this.immediatePredecessorVertices.forEach(function (immediatePredecessorVertex) {
        immediatePredecessorVertex.removeImmediateSuccessorVertex(immediateSuccessorVertex);
      });

      this.immediatePredecessorVertices = [];
    }
  }, {
    key: 'removeOutgoingEdges',
    value: function removeOutgoingEdges() {
      var immediatePredecessorVertex = this; ///

      this.immediateSuccessorVertices.forEach(function (immediateSuccessorVertex) {
        immediateSuccessorVertex.removeImmediateSuccessorVertex(immediatePredecessorVertex);
      });

      this.immediateSuccessorVertices = [];
    }
  }, {
    key: 'resetVisited',
    value: function resetVisited() {
      this.visited = false;
    }
  }, {
    key: 'addImmediatePredecessorVertex',
    value: function addImmediatePredecessorVertex(immediatePredecessorVertex) {
      this.immediatePredecessorVertices.push(immediatePredecessorVertex);
    }
  }, {
    key: 'addImmediateSuccessorVertex',
    value: function addImmediateSuccessorVertex(immediateSuccessorVertex) {
      this.immediateSuccessorVertices.push(immediateSuccessorVertex);
    }
  }, {
    key: 'forwardsDepthFirstSearch',
    value: function forwardsDepthFirstSearch(callback) {
      var terminate = false;

      if (this.visited === false) {
        this.visited = true;

        var visitedVertex = this; ///

        terminate = callback(visitedVertex);

        if (terminate !== true) {
          this.someImmediateSuccessorVertex(function (immediateSuccessorVertex) {
            terminate = immediateSuccessorVertex.forwardsDepthFirstSearch(callback);

            return terminate;
          });
        }
      }

      return terminate;
    }
  }, {
    key: 'backwardsDepthFirstSearch',
    value: function backwardsDepthFirstSearch(callback) {
      var terminate = false;

      if (this.visited === false) {
        this.visited = true;

        var visitedVertex = this; ///

        terminate = callback(visitedVertex);

        if (terminate !== true) {
          this.someImmediatePredecessorVertex(function (immediatePredecessorVertex) {
            terminate = immediatePredecessorVertex.backwardsDepthFirstSearch(callback);

            return terminate;
          });
        }
      }

      return terminate;
    }
  }, {
    key: 'forEachImmediatePredecessorVertex',
    value: function forEachImmediatePredecessorVertex(callback) {
      this.immediatePredecessorVertices.forEach(callback);
    }
  }, {
    key: 'forEachImmediateSuccessorVertex',
    value: function forEachImmediateSuccessorVertex(callback) {
      this.immediateSuccessorVertices.forEach(callback);
    }
  }, {
    key: 'someImmediatePredecessorVertex',
    value: function someImmediatePredecessorVertex(callback) {
      this.immediatePredecessorVertices.some(callback);
    }
  }, {
    key: 'someImmediateSuccessorVertex',
    value: function someImmediateSuccessorVertex(callback) {
      this.immediateSuccessorVertices.some(callback);
    }
  }], [{
    key: 'fromNameAndIndex',
    value: function fromNameAndIndex(name, index) {
      var visited = false,
          ///
      immediatePredecessorVertices = [],
          immediateSuccessorVertices = [],
          dependencyVertex = new Vertex(name, index, visited, immediatePredecessorVertices, immediateSuccessorVertices);

      return dependencyVertex;
    }
  }]);

  return Vertex;
}();

module.exports = Vertex;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2VzNi92ZXJ0ZXguanMiXSwibmFtZXMiOlsidmVydGV4VXRpbGl0aWVzIiwicmVxdWlyZSIsInZlcnRleE5hbWVzRnJvbVZlcnRpY2VzIiwidG9wb2xvZ2ljYWxseU9yZGVyVmVydGljZXMiLCJWZXJ0ZXgiLCJuYW1lIiwiaW5kZXgiLCJ2aXNpdGVkIiwiaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0aWNlcyIsImltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRpY2VzIiwicHJlZGVjZXNzb3JWZXJ0ZXhNYXAiLCJmb3JFYWNoSW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgiLCJpbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleCIsInByZWRlY2Vzc29yVmVydGV4IiwicHJlZGVjZXNzb3JWZXJ0ZXhOYW1lIiwiZ2V0TmFtZSIsImdldFByZWRlY2Vzc29yVmVydGljZXMiLCJzdWNjZXNzb3JWZXJ0ZXhNYXAiLCJmb3JFYWNoSW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4IiwiaW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4Iiwic3VjY2Vzc29yVmVydGV4Iiwic3VjY2Vzc29yVmVydGV4TmFtZSIsImdldFN1Y2Nlc3NvclZlcnRpY2VzIiwicHJlZGVjZXNzb3JWZXJ0aWNlcyIsInByZWRlY2Vzc29yVmVydGV4TmFtZXMiLCJtYXAiLCJzdWNjZXNzb3JWZXJ0aWNlcyIsInN1Y2Nlc3NvclZlcnRleE5hbWVzIiwiZ2V0UHJlZGVjZXNzb3JWZXJ0ZXhNYXAiLCJPYmplY3QiLCJrZXlzIiwiZ2V0U3VjY2Vzc29yVmVydGV4TWFwIiwidG9wb2xvZ2ljYWxseU9yZGVyZWRQcmVkZWNlc3NvclZlcnRpY2VzIiwidG9wb2xvZ2ljYWxseU9yZGVyZWRQcmVkZWNlc3NvclZlcnRleE5hbWVzIiwic291cmNlVmVydGV4IiwiZm9yd2FyZHNBZmZlY3RlZFZlcnRpY2VzIiwiZm9yd2FyZHNEZXB0aEZpcnN0U2VhcmNoIiwidmlzaXRlZFZlcnRleCIsImZvcndhcmRzQWZmZWN0ZWRWZXJ0ZXgiLCJ0ZXJtaW5hdGUiLCJwdXNoIiwiZm9yRWFjaCIsInJlc2V0VmlzaXRlZCIsImJhY2t3YXJkc0FmZmVjdGVkVmVydGljZXMiLCJiYWNrd2FyZHNEZXB0aEZpcnN0U2VhcmNoIiwiYmFja3dhcmRzQWZmZWN0ZWRWZXJ0ZXgiLCJ2ZXJ0ZXgiLCJ2ZXJ0ZXhJbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleCIsImluY2x1ZGVzIiwidmVydGV4SW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4Iiwic291cmNlVmVydGV4SW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgiLCJpc1ZlcnRleEltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4IiwiZWRnZVByZXNlbnQiLCJ0YXJnZXRWZXJ0ZXgiLCJ0YXJnZXRWZXJ0ZXhJbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgiLCJpc1ZlcnRleEltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleCIsImluZGV4T2YiLCJzdGFydCIsImRlbGV0ZUNvdW50Iiwic3BsaWNlIiwicmVtb3ZlSW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4IiwiY2FsbGJhY2siLCJzb21lSW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4Iiwic29tZUltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4Iiwic29tZSIsImRlcGVuZGVuY3lWZXJ0ZXgiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0FBRUEsSUFBTUEsa0JBQWtCQyxRQUFRLG9CQUFSLENBQXhCOztJQUVRQyx1QixHQUF3REYsZSxDQUF4REUsdUI7SUFBeUJDLDBCLEdBQStCSCxlLENBQS9CRywwQjs7SUFFM0JDLE07QUFDSixrQkFBWUMsSUFBWixFQUFrQkMsS0FBbEIsRUFBeUJDLE9BQXpCLEVBQWtDQyw0QkFBbEMsRUFBZ0VDLDBCQUFoRSxFQUE0RjtBQUFBOztBQUMxRixTQUFLSixJQUFMLEdBQVlBLElBQVo7QUFDQSxTQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxTQUFLQyxPQUFMLEdBQWVBLE9BQWY7QUFDQSxTQUFLQyw0QkFBTCxH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QUFULENBQVo7O0FBRUEsWUFBSUUsY0FBYyxJQUFsQixFQUF3QjtBQUN0QixlQUFLd0IsOEJBQUwsQ0FBb0MsVUFBU25ELDBCQUFULEVBQXFDO0FBQ3ZFMkIsd0JBQVkzQiwyQkFBMkJnQyx5QkFBM0IsQ0FBcURpQixRQUFyRCxDQUFaOztBQUVBLG1CQUFPdEIsU0FBUDtBQUNELFdBSkQ7QUFLRDtBQUNGOztBQUVELGFBQU9BLFNBQVA7QUFDRDs7O3NEQUVpQ3NCLFEsRUFBVTtBQUMxQyxXQUFLckQsNEJBQUwsQ0FBa0NpQyxPQUFsQyxDQUEwQ29CLFFBQTFDO0FBQ0Q7OztvREFFK0JBLFEsRUFBVTtBQUN4QyxXQUFLcEQsMEJBQUwsQ0FBZ0NnQyxPQUFoQyxDQUF3Q29CLFFBQXhDO0FBQ0Q7OzttREFFOEJBLFEsRUFBVTtBQUN2QyxXQUFLckQsNEJBQUwsQ0FBa0N3RCxJQUFsQyxDQUF1Q0gsUUFBdkM7QUFDRDs7O2lEQUU0QkEsUSxFQUFVO0FBQ3JDLFdBQUtwRCwwQkFBTCxDQUFnQ3VELElBQWhDLENBQXFDSCxRQUFyQztBQUNEOzs7cUNBRXVCeEQsSSxFQUFNQyxLLEVBQU87QUFDbkMsVUFBTUMsVUFBVSxLQUFoQjtBQUFBLFVBQXdCO0FBQ2xCQyxxQ0FBK0IsRUFEckM7QUFBQSxVQUVNQyw2QkFBNkIsRUFGbkM7QUFBQSxVQUdNd0QsbUJBQW1CLElBQUk3RCxNQUFKLENBQVdDLElBQVgsRUFBaUJDLEtBQWpCLEVBQXdCQyxPQUF4QixFQUFpQ0MsNEJBQWpDLEVBQStEQywwQkFBL0QsQ0FIekI7O0FBS0EsYUFBT3dELGdCQUFQO0FBQ0Q7Ozs7OztBQUdIQyxPQUFPQyxPQUFQLEdBQWlCL0QsTUFBakIiLCJmaWxlIjoidmVydGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB2ZXJ0ZXhVdGlsaXRpZXMgPSByZXF1aXJlKCcuL3V0aWxpdGllcy92ZXJ0ZXgnKTtcblxuY29uc3QgeyB2ZXJ0ZXhOYW1lc0Zyb21WZXJ0aWNlcywgdG9wb2xvZ2ljYWxseU9yZGVyVmVydGljZXMgfSA9IHZlcnRleFV0aWxpdGllcztcblxuY2xhc3MgVmVydGV4IHtcbiAgY29uc3RydWN0b3IobmFtZSwgaW5kZXgsIHZpc2l0ZWQsIGltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGljZXMsIGltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRpY2VzKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gICAgdGhpcy52aXNpdGVkID0gdmlzaXRlZDtcbiAgICB0aGlzLmltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGljZXMgPSBpbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRpY2VzO1xuICAgIHRoaXMuaW1tZWRpYXRlU3VjY2Vzc29yVmVydGljZXMgPSBpbW1lZGlhdGVTdWNjZXNzb3JWZXJ0aWNlcztcbiAgfVxuXG4gIGdldE5hbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMubmFtZTtcbiAgfVxuXG4gIGdldEluZGV4KCkge1xuICAgIHJldHVybiB0aGlzLmluZGV4O1xuICB9XG5cbiAgaXNWaXNpdGVkKCkge1xuICAgIHJldHVybiB0aGlzLnZpc2l0ZWQ7XG4gIH1cblxuICBnZXRJbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRpY2VzKCkge1xuICAgIHJldHVybiB0aGlzLmltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGljZXM7XG4gIH1cblxuICBnZXRJbW1lZGlhdGVTdWNjZXNzb3JWZXJ0aWNlcygpIHtcbiAgICByZXR1cm4gdGhpcy5pbW1lZGlhdGVTdWNjZXNzb3JWZXJ0aWNlcztcbiAgfVxuXG4gIGdldFByZWRlY2Vzc29yVmVydGV4TWFwKHByZWRlY2Vzc29yVmVydGV4TWFwID0ge30pIHtcbiAgICB0aGlzLmZvckVhY2hJbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleChmdW5jdGlvbihpbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleCkge1xuICAgICAgY29uc3QgcHJlZGVjZXNzb3JWZXJ0ZXggPSBpbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleCwgLy8vXG4gICAgICAgICAgICBwcmVkZWNlc3NvclZlcnRleE5hbWUgPSBwcmVkZWNlc3NvclZlcnRleC5nZXROYW1lKCk7XG5cbiAgICAgIHByZWRlY2Vzc29yVmVydGV4TWFwW3ByZWRlY2Vzc29yVmVydGV4TmFtZV0gPSBwcmVkZWNlc3NvclZlcnRleDtcblxuICAgICAgcHJlZGVjZXNzb3JWZXJ0ZXguZ2V0UHJlZGVjZXNzb3JWZXJ0aWNlcyhwcmVkZWNlc3NvclZlcnRleE1hcCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJlZGVjZXNzb3JWZXJ0ZXhNYXA7XG4gIH1cblxuICBnZXRTdWNjZXNzb3JWZXJ0ZXhNYXAoc3VjY2Vzc29yVmVydGV4TWFwID0ge30pIHtcbiAgICB0aGlzLmZvckVhY2hJbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgoZnVuY3Rpb24oaW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4KSB7XG4gICAgICBjb25zdCBzdWNjZXNzb3JWZXJ0ZXggPSBpbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgsIC8vL1xuICAgICAgICAgICAgc3VjY2Vzc29yVmVydGV4TmFtZSA9IHN1Y2Nlc3NvclZlcnRleC5nZXROYW1lKCk7XG5cbiAgICAgIHN1Y2Nlc3NvclZlcnRleE1hcFtzdWNjZXNzb3JWZXJ0ZXhOYW1lXSA9IHN1Y2Nlc3NvclZlcnRleDtcblxuICAgICAgc3VjY2Vzc29yVmVydGV4LmdldFN1Y2Nlc3NvclZlcnRpY2VzKHN1Y2Nlc3NvclZlcnRleE1hcCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3VjY2Vzc29yVmVydGV4TWFwO1xuICB9XG4gIFxuICBnZXRQcmVkZWNlc3NvclZlcnRleE5hbWVzKCkge1xuICAgIGNvbnN0IHByZWRlY2Vzc29yVmVydGljZXMgPSB0aGlzLmdldFByZWRlY2Vzc29yVmVydGljZXMoKSxcbiAgICAgICAgICBwcmVkZWNlc3NvclZlcnRleE5hbWVzID0gcHJlZGVjZXNzb3JWZXJ0aWNlcy5tYXAoZnVuY3Rpb24ocHJlZGVjZXNzb3JWZXJ0ZXgpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWRlY2Vzc29yVmVydGV4TmFtZSA9IHByZWRlY2Vzc29yVmVydGV4LmdldE5hbWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHByZWRlY2Vzc29yVmVydGV4TmFtZTtcbiAgICAgICAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gcHJlZGVjZXNzb3JWZXJ0ZXhOYW1lcztcbiAgfVxuXG4gIGdldFN1Y2Nlc3NvclZlcnRleE5hbWVzKCkge1xuICAgIGNvbnN0IHN1Y2Nlc3NvclZlcnRpY2VzID0gdGhpcy5nZXRTdWNjZXNzb3JWZXJ0aWNlcygpLFxuICAgICAgICAgIHN1Y2Nlc3NvclZlcnRleE5hbWVzID0gc3VjY2Vzc29yVmVydGljZXMubWFwKGZ1bmN0aW9uKHN1Y2Nlc3NvclZlcnRleCkge1xuICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NvclZlcnRleE5hbWUgPSBzdWNjZXNzb3JWZXJ0ZXguZ2V0TmFtZSgpO1xuXG4gICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NvclZlcnRleE5hbWU7XG4gICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHN1Y2Nlc3NvclZlcnRleE5hbWVzO1xuICB9XG5cbiAgZ2V0UHJlZGVjZXNzb3JWZXJ0aWNlcygpIHtcbiAgICBjb25zdCBwcmVkZWNlc3NvclZlcnRleE1hcCA9IHRoaXMuZ2V0UHJlZGVjZXNzb3JWZXJ0ZXhNYXAoKSxcbiAgICAgICAgICBwcmVkZWNlc3NvclZlcnRleE5hbWVzID0gT2JqZWN0LmtleXMocHJlZGVjZXNzb3JWZXJ0ZXhNYXApLFxuICAgICAgICAgIHByZWRlY2Vzc29yVmVydGljZXMgPSBwcmVkZWNlc3NvclZlcnRleE5hbWVzLm1hcChmdW5jdGlvbihwcmVkZWNlc3NvclZlcnRleE5hbWUpIHtcbiAgICAgICAgICAgIGNvbnN0IHByZWRlY2Vzc29yVmVydGV4ID0gcHJlZGVjZXNzb3JWZXJ0ZXhNYXBbcHJlZGVjZXNzb3JWZXJ0ZXhOYW1lXTtcblxuICAgICAgICAgICAgcmV0dXJuIHByZWRlY2Vzc29yVmVydGV4O1xuICAgICAgICAgIH0pO1xuXG4gICAgcmV0dXJuIHByZWRlY2Vzc29yVmVydGljZXM7XG4gIH1cblxuICBnZXRTdWNjZXNzb3JWZXJ0aWNlcygpIHtcbiAgICBjb25zdCBzdWNjZXNzb3JWZXJ0ZXhNYXAgPSB0aGlzLmdldFN1Y2Nlc3NvclZlcnRleE1hcCgpLFxuICAgICAgICAgIHN1Y2Nlc3NvclZlcnRleE5hbWVzID0gT2JqZWN0LmtleXMoc3VjY2Vzc29yVmVydGV4TWFwKSxcbiAgICAgICAgICBzdWNjZXNzb3JWZXJ0aWNlcyA9IHN1Y2Nlc3NvclZlcnRleE5hbWVzLm1hcChmdW5jdGlvbihzdWNjZXNzb3JWZXJ0ZXhOYW1lKSB7XG4gICAgICAgICAgICBjb25zdCBzdWNjZXNzb3JWZXJ0ZXggPSBzdWNjZXNzb3JWZXJ0ZXhNYXBbc3VjY2Vzc29yVmVydGV4TmFtZV07XG4gIFxuICAgICAgICAgICAgcmV0dXJuIHN1Y2Nlc3NvclZlcnRleDtcbiAgICAgICAgICB9KTtcblxuICAgIHJldHVybiBzdWNjZXNzb3JWZXJ0aWNlcztcbiAgfVxuXG4gIGdldFRvcG9sb2dpY2FsbHlPcmRlcmVkUHJlZGVjZXNzb3JWZXJ0ZXhOYW1lcygpIHtcbiAgICBjb25zdCBwcmVkZWNlc3NvclZlcnRpY2VzID0gdGhpcy5nZXRQcmVkZWNlc3NvclZlcnRpY2VzKCk7XG5cbiAgICB0b3BvbG9naWNhbGx5T3JkZXJWZXJ0aWNlcyhwcmVkZWNlc3NvclZlcnRpY2VzKTtcblxuICAgIGNvbnN0IHRvcG9sb2dpY2FsbHlPcmRlcmVkUHJlZGVjZXNzb3JWZXJ0aWNlcyA9IHByZWRlY2Vzc29yVmVydGljZXMsICAvLy9cbiAgICAgICAgICB0b3BvbG9naWNhbGx5T3JkZXJlZFByZWRlY2Vzc29yVmVydGV4TmFtZXMgPSB2ZXJ0ZXhOYW1lc0Zyb21WZXJ0aWNlcyh0b3BvbG9naWNhbGx5T3JkZXJlZFByZWRlY2Vzc29yVmVydGljZXMpO1xuXG4gICAgcmV0dXJuIHRvcG9sb2dpY2FsbHlPcmRlcmVkUHJlZGVjZXNzb3JWZXJ0ZXhOYW1lcztcbiAgfVxuICBcbiAgZ2V0Rm9yd2FyZHNBZmZlY3RlZFZlcnRpY2VzKHNvdXJjZVZlcnRleCkge1xuICAgIGNvbnN0IGZvcndhcmRzQWZmZWN0ZWRWZXJ0aWNlcyA9IFtdO1xuXG4gICAgdGhpcy5mb3J3YXJkc0RlcHRoRmlyc3RTZWFyY2goZnVuY3Rpb24odmlzaXRlZFZlcnRleCkge1xuICAgICAgY29uc3QgZm9yd2FyZHNBZmZlY3RlZFZlcnRleCA9IHZpc2l0ZWRWZXJ0ZXgsICAvLy9cbiAgICAgICAgICAgIHRlcm1pbmF0ZSA9IChmb3J3YXJkc0FmZmVjdGVkVmVydGV4ID09PSBzb3VyY2VWZXJ0ZXgpOyAgLy8vXG5cbiAgICAgIGZvcndhcmRzQWZmZWN0ZWRWZXJ0aWNlcy5wdXNoKGZvcndhcmRzQWZmZWN0ZWRWZXJ0ZXgpO1xuXG4gICAgICByZXR1cm4gdGVybWluYXRlO1xuICAgIH0pO1xuXG4gICAgZm9yd2FyZHNBZmZlY3RlZFZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24oZm9yd2FyZHNBZmZlY3RlZFZlcnRleCkge1xuICAgICAgZm9yd2FyZHNBZmZlY3RlZFZlcnRleC5yZXNldFZpc2l0ZWQoKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmb3J3YXJkc0FmZmVjdGVkVmVydGljZXM7XG4gIH1cblxuICBnZXRCYWNrd2FyZHNBZmZlY3RlZFZlcnRpY2VzKCkge1xuICAgIGNvbnN0IGJhY2t3YXJkc0FmZmVjdGVkVmVydGljZXMgPSBbXTtcblxuICAgIHRoaXMuYmFja3dhcmRzRGVwdGhGaXJzdFNlYXJjaChmdW5jdGlvbih2aXNpdGVkVmVydGV4KSB7XG4gICAgICBjb25zdCBiYWNrd2FyZHNBZmZlY3RlZFZlcnRleCA9IHZpc2l0ZWRWZXJ0ZXg7ICAvLy9cblxuICAgICAgYmFja3dhcmRzQWZmZWN0ZWRWZXJ0aWNlcy5wdXNoKGJhY2t3YXJkc0FmZmVjdGVkVmVydGV4KTtcbiAgICB9KTtcblxuICAgIGJhY2t3YXJkc0FmZmVjdGVkVmVydGljZXMuZm9yRWFjaChmdW5jdGlvbihiYWNrd2FyZHNBZmZlY3RlZFZlcnRleCkge1xuICAgICAgYmFja3dhcmRzQWZmZWN0ZWRWZXJ0ZXgucmVzZXRWaXNpdGVkKCk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gYmFja3dhcmRzQWZmZWN0ZWRWZXJ0aWNlcztcbiAgfVxuICBcbiAgaXNWZXJ0ZXhJbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleCh2ZXJ0ZXgpIHtcbiAgICBjb25zdCB2ZXJ0ZXhJbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleCA9IHRoaXMuaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0aWNlcy5pbmNsdWRlcyh2ZXJ0ZXgpO1xuXG4gICAgcmV0dXJuIHZlcnRleEltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4O1xuICB9XG5cbiAgaXNWZXJ0ZXhJbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgodmVydGV4KSB7XG4gICAgY29uc3QgdmVydGV4SW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4ID0gdGhpcy5pbW1lZGlhdGVTdWNjZXNzb3JWZXJ0aWNlcy5pbmNsdWRlcyh2ZXJ0ZXgpO1xuXG4gICAgcmV0dXJuIHZlcnRleEltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleDtcbiAgfVxuXG4gIGlzRWRnZVByZXNlbnRCeVNvdXJjZVZlcnRleChzb3VyY2VWZXJ0ZXgpIHtcbiAgICBjb25zdCBzb3VyY2VWZXJ0ZXhJbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleCA9IHRoaXMuaXNWZXJ0ZXhJbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleChzb3VyY2VWZXJ0ZXgpLFxuICAgICAgICAgIGVkZ2VQcmVzZW50ID0gc291cmNlVmVydGV4SW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXg7IC8vL1xuXG4gICAgcmV0dXJuIGVkZ2VQcmVzZW50O1xuICB9XG5cbiAgaXNFZGdlUHJlc2VudEJ5VGFyZ2V0VmVydGV4KHRhcmdldFZlcnRleCkge1xuICAgIGNvbnN0IHRhcmdldFZlcnRleEltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleCA9IHRoaXMuaXNWZXJ0ZXhJbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgodGFyZ2V0VmVydGV4KSxcbiAgICAgICAgICBlZGdlUHJlc2VudCA9IHRhcmdldFZlcnRleEltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleDsgLy8vXG5cbiAgICByZXR1cm4gZWRnZVByZXNlbnQ7XG4gIH1cblxuICBzZXROYW1lKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG5cbiAgc2V0SW5kZXgoaW5kZXgpIHtcbiAgICB0aGlzLmluZGV4ID0gaW5kZXg7XG4gIH1cblxuICBzZXRWaXNpdGVkKHZpc2l0ZWQpIHtcbiAgICB0aGlzLnZpc2l0ZWQgPSB2aXNpdGVkO1xuICB9XG5cbiAgcmVtb3ZlSW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgoaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0aWNlcy5pbmRleE9mKGltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4KSxcbiAgICAgICAgICBzdGFydCA9IGluZGV4LCAgLy8vXG4gICAgICAgICAgZGVsZXRlQ291bnQgPSAxO1xuXG4gICAgdGhpcy5pbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRpY2VzLnNwbGljZShzdGFydCwgZGVsZXRlQ291bnQpO1xuICB9XG5cbiAgcmVtb3ZlSW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4KGltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleCkge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbW1lZGlhdGVTdWNjZXNzb3JWZXJ0aWNlcy5pbmRleE9mKGltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleCksXG4gICAgICAgICAgc3RhcnQgPSBpbmRleCwgIC8vL1xuICAgICAgICAgIGRlbGV0ZUNvdW50ID0gMTtcblxuICAgIHRoaXMuaW1tZWRpYXRlU3VjY2Vzc29yVmVydGljZXMuc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCk7XG4gIH1cbiAgXG4gIHJlbW92ZUluY29taW5nRWRnZXMoKSB7XG4gICAgY29uc3QgaW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4ID0gdGhpczsgLy8vXG4gICAgXG4gICAgdGhpcy5pbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24oaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgpIHtcbiAgICAgIGltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4LnJlbW92ZUltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleChpbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5pbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRpY2VzID0gW107XG4gIH1cblxuICByZW1vdmVPdXRnb2luZ0VkZ2VzKCkge1xuICAgIGNvbnN0IGltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4ID0gdGhpczsgLy8vXG5cbiAgICB0aGlzLmltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRpY2VzLmZvckVhY2goZnVuY3Rpb24oaW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4KSB7XG4gICAgICBpbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgucmVtb3ZlSW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4KGltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4KTtcbiAgICB9KTtcblxuICAgIHRoaXMuaW1tZWRpYXRlU3VjY2Vzc29yVmVydGljZXMgPSBbXTtcbiAgfVxuXG4gIHJlc2V0VmlzaXRlZCgpIHtcbiAgICB0aGlzLnZpc2l0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIGFkZEltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4KGltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGV4KSB7XG4gICAgdGhpcy5pbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRpY2VzLnB1c2goaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgpO1xuICB9XG5cbiAgYWRkSW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4KGltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleCkge1xuICAgIHRoaXMuaW1tZWRpYXRlU3VjY2Vzc29yVmVydGljZXMucHVzaChpbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgpO1xuICB9XG4gIFxuICBmb3J3YXJkc0RlcHRoRmlyc3RTZWFyY2goY2FsbGJhY2spIHtcbiAgICBsZXQgdGVybWluYXRlID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy52aXNpdGVkID09PSBmYWxzZSkge1xuICAgICAgdGhpcy52aXNpdGVkID0gdHJ1ZTtcblxuICAgICAgY29uc3QgdmlzaXRlZFZlcnRleCA9IHRoaXM7ICAvLy9cblxuICAgICAgdGVybWluYXRlID0gY2FsbGJhY2sodmlzaXRlZFZlcnRleCk7XG5cbiAgICAgIGlmICh0ZXJtaW5hdGUgIT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zb21lSW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4KGZ1bmN0aW9uKGltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleCkge1xuICAgICAgICAgIHRlcm1pbmF0ZSA9IGltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRleC5mb3J3YXJkc0RlcHRoRmlyc3RTZWFyY2goY2FsbGJhY2spO1xuXG4gICAgICAgICAgcmV0dXJuIHRlcm1pbmF0ZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlcm1pbmF0ZTtcbiAgfVxuXG4gIGJhY2t3YXJkc0RlcHRoRmlyc3RTZWFyY2goY2FsbGJhY2spIHtcbiAgICBsZXQgdGVybWluYXRlID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy52aXNpdGVkID09PSBmYWxzZSkge1xuICAgICAgdGhpcy52aXNpdGVkID0gdHJ1ZTtcblxuICAgICAgY29uc3QgdmlzaXRlZFZlcnRleCA9IHRoaXM7ICAvLy9cblxuICAgICAgdGVybWluYXRlID0gY2FsbGJhY2sodmlzaXRlZFZlcnRleCk7XG5cbiAgICAgIGlmICh0ZXJtaW5hdGUgIT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5zb21lSW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgoZnVuY3Rpb24oaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgpIHtcbiAgICAgICAgICB0ZXJtaW5hdGUgPSBpbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleC5iYWNrd2FyZHNEZXB0aEZpcnN0U2VhcmNoKGNhbGxiYWNrKTtcblxuICAgICAgICAgIHJldHVybiB0ZXJtaW5hdGU7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0ZXJtaW5hdGU7XG4gIH1cblxuICBmb3JFYWNoSW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0ZXgoY2FsbGJhY2spIHtcbiAgICB0aGlzLmltbWVkaWF0ZVByZWRlY2Vzc29yVmVydGljZXMuZm9yRWFjaChjYWxsYmFjayk7XG4gIH1cblxuICBmb3JFYWNoSW1tZWRpYXRlU3VjY2Vzc29yVmVydGV4KGNhbGxiYWNrKSB7XG4gICAgdGhpcy5pbW1lZGlhdGVTdWNjZXNzb3JWZXJ0aWNlcy5mb3JFYWNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNvbWVJbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRleChjYWxsYmFjaykge1xuICAgIHRoaXMuaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0aWNlcy5zb21lKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHNvbWVJbW1lZGlhdGVTdWNjZXNzb3JWZXJ0ZXgoY2FsbGJhY2spIHtcbiAgICB0aGlzLmltbWVkaWF0ZVN1Y2Nlc3NvclZlcnRpY2VzLnNvbWUoY2FsbGJhY2spO1xuICB9XG5cbiAgc3RhdGljIGZyb21OYW1lQW5kSW5kZXgobmFtZSwgaW5kZXgpIHtcbiAgICBjb25zdCB2aXNpdGVkID0gZmFsc2UsICAvLy9cbiAgICAgICAgICBpbW1lZGlhdGVQcmVkZWNlc3NvclZlcnRpY2VzID0gW10sXG4gICAgICAgICAgaW1tZWRpYXRlU3VjY2Vzc29yVmVydGljZXMgPSBbXSxcbiAgICAgICAgICBkZXBlbmRlbmN5VmVydGV4ID0gbmV3IFZlcnRleChuYW1lLCBpbmRleCwgdmlzaXRlZCwgaW1tZWRpYXRlUHJlZGVjZXNzb3JWZXJ0aWNlcywgaW1tZWRpYXRlU3VjY2Vzc29yVmVydGljZXMpO1xuXG4gICAgcmV0dXJuIGRlcGVuZGVuY3lWZXJ0ZXg7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBWZXJ0ZXg7XG4iXX0=