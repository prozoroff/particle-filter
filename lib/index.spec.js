/* global describe, it */

var expect = require('chai').expect
var particleFilter = require('./index')

describe('particle filter', function () {
  it('should export a function', function () {
    expect(particleFilter).to.be.a('function')
  })
})
