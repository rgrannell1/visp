
const {expect} = require('chai')
const visp = require('../../src/visp')
const {demand, suite, evaluate} = require('../utils')

suite('sum', () => {
  const parts = [
     [`sum*(())`, 0],
     [`sum*((1 2))`, 3],
     [`sum*()`, 0],
     [`sum*(1 2)`, 3]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

suite('product', () => {
  const parts = [
     [`product*(())`, 1],
     [`product*((2 3))`, 6],
     [`product*()`, 1],
     [`product*(2 3)`, 6]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})
