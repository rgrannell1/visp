
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

tests['set-equal'] = {}
tests['set-equal'].docs = `
## set-equal

Test that set-equal
`
tests['set-equal'].run = suite('set-equal', () => {
  const parts = [
     ['set-equal(set*() set*())', true],
     ['set-equal(set*(0) set*())', false],
     ['set-equal(set*(0) set*(1))', false],
     ['set-equal(set*(0) set*(0))', true],
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

tests['set-has'] = {}
tests['set-has'].docs = `
## set-has

Test that set-has
`
tests['set-has'].run = suite('set-has', () => {
  const parts = [
     ['set-has(set(()) 1)', false],
     ['set-has(set((1)) 1)', true],
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})
module.exports = tests