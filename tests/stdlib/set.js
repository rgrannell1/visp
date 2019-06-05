
const {expect} = require('chai')
const visp = require('../../src/visp')
const {demand, suite, evaluate} = require('../utils')

const tests = {}

tests.set = {}
tests.set.docs = `
## set

Test that set
`
tests.set.run = suite('set', () => {
  const parts = [
     ['set(())', new Set()],
     ['set*()', new Set()],
     ['set((0 1))', new Set([0, 1])],
     ['set*(0 1)', new Set([0, 1])],
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

module.exports = tests