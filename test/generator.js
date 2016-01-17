'use strict'
// **Github:** https://github.com/thunks/thunk-workers
//
// **License:** MIT
/* global describe, it */

var assert = require('assert')
var thunk = require('thunks')()
var thunkWorkers = require('../index')

describe('thunk-workers with Promise and Generator', function () {
  it('support Promise', function *() {
    var workshop = thunkWorkers()

    var res = yield workshop(function () {
      return Promise.resolve(1)
    })
    assert.strictEqual(res, 1)

    try {
      yield workshop(function () {
        return Promise.reject('error')
      })
    } catch (err) {
      assert.strictEqual(err, 'error')
    }
  })

  it('support Generator function', function *() {
    var workshop = thunkWorkers()
    var time = Date.now()

    var res = yield workshop(function *() {
      yield thunk.delay(100)
      return yield Promise.resolve(1)
    })
    assert.strictEqual(res, 1)
    assert((time + 100) <= Date.now())

    res = yield workshop(function () {
      return function *() {
        return yield thunk(2)
      }
    })

    assert.strictEqual(res, 2)
  })
})
