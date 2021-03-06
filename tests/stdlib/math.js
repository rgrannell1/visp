
const {expect} = require('chai')
const visp = require('../../src/visp')
const {demand, suite, evaluate} = require('../utils')

const tests = {}

tests.sum = {}
tests.sum.docs = `
## sum

Test that sum
`
tests.sum.run = suite('sum', () => {
  const parts = [
     [`sum(())`, 0],
     [`sum((1 2))`, 3],
     [`sum*()`, 0],
     [`sum*(1 2)`, 3]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

tests.product = {}
tests.product.docs = `
## product

Test that product
`
tests.product.run = suite('product  ', () => {
  const parts = [
     [`product(())`, 1],
     [`product((2 3))`, 6],
     [`product*()`, 1],
     [`product*(2 3)`, 6]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

tests.clamp = {}
tests.clamp.docs = `
## clamp

Test that clamp
`
tests.clamp.run = suite('clamp  ', () => {
  const parts = [
     ['clamp(0, 0, 0)', 0],
     ['clamp(0, 1, 0)', 0],
     ['clamp(0, 1, 1)', 1],
     ['clamp(0, -1, 1)', 0]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

module.exports = tests