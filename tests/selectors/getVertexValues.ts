'use strict'

import mocha = require('mocha')
import expect = require('expect')

import { store, removeNodes } from '../graphSetup'
import { getVertexValues } from '../../src/graph'

let store = graphSetup(emptyStore)

let state = store.getState()

describe("getVertexValues", () => {
  it("looks up and returns an array of existing vertex values", () => {
    expect(getVertexValues(state)).toEqual(
      [
        {
          name: 'blah'
        }
      ]
    )
  })
})
