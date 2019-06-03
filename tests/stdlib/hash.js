
const {expect} = require('chai')
const visp = require('../../src/visp')
const {demand, suite, evaluate} = require('../utils')

suite('hash', () => {
  const parts = [
    [
      `
      hash((
        ("a" 1)
        ("b" 2)))
      `,
      { a: 1, b: 2 }
    ],
    [
      `
      hash*(
        ("a" 1)
        ("b" 2))
      `,
      { a: 1, b: 2 }
    ]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

suite('hash-keys', () => {
  const parts = [
    [
      `
      x <- hash*(
        ("a" 1)
        ("b" 2))
      hash-keys(x)
      `,
      ['a', 'b']
    ]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

suite('hash-values', () => {
  const parts = [
    [
      `
      x <- hash*(
        ("a" 1)
        ("b" 2))
      hash-values(x)
      `,
      [1, 2]
    ]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

suite('hash-size', () => {
  const parts = [
    [
      `
      x <- hash*(
        ("a" 1)
        ("b" 2))
      hash-size(x)
      `,
      2
    ]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})

suite('hash-entries', () => {
  const parts = [
    [
      `
      x <- hash*(
        ("a" 1)
        ("b" 2))
      hash-entries(x)
      `,
      [['a', 1], ['b', 2]]
    ]
  ]

  for (const [program, result] of parts) {
    expect(evaluate(program)).to.deep.equal(result)
  }
})
