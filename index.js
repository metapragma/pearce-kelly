'use strict';

var parsers = {
  'Edge': require('./lib/edge'),
  'DirectedAcyclicGraph': require('./lib/directedAcyclicGraph')
};

module.exports = parsers;
