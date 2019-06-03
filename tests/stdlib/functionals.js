
const {expect} = require('chai')
const visp = require('../../src/visp')
const {demand, suite, evaluate} = require('../utils')

const tests = {}

tests.identity = {}
tests.identity.docs = `
## identity

Test that identity returns arbitrary values provided to it
`
tests.identity.run = suite('identity', () => {
  expect(evaluate('identity(10)')).to.equal(10)
})

tests['truth?'] = {}
tests['truth?'].docs = `
## truth?

Test that truth? returns true
`

tests['truth?'].run = suite('truth?', () => {
  expect(evaluate('truth?()')).to.equal(true)
})

tests['falsity?'] = {}
tests['falsity?'].docs = `
## falsity?

Test that falsity? returns false
`
tests['falsity?'].run = suite('falsity?', () => {
  expect(evaluate('falsity?()')).to.equal(false)
})

module.exports = tests
