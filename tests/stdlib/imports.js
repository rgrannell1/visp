
const {expect} = require('chai')
const visp = require('../../src/visp')
const {demand, suite, evaluate} = require('../utils')

const tests = {}

tests['require'] = {}
tests['require'].docs = `
test require
`
tests['require'].run = suite('require', () => {
  expect(require('fs')).to.be.equal(evaluate('require("fs")'))
})

module.exports = tests
