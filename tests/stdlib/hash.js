
const {expect} = require('chai')
const visp = require('../../src/visp')
const {demand, suite, evaluate} = require('../utils')

const tests = {}

tests.hash = {}
tests.hash.docs = `
## hash

Test that hash
`
tests.hash.run = suite('hash', () => {
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

tests['hash-keys'] = {}
tests['hash-keys'].docs = `
## hash-keys

Test that hash-keys
`
tests['hash-keys'].run = suite('hash-keys', () => {
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
tests['hash-values'] = {}
tests['hash-values'].docs = `
## hash-values

Test that hash-values
`
tests['hash-values'].run = suite('hash-values', () => {
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

tests['hash-size'] = {}
tests['hash-size'].docs = `
## hash-size

Test that hash-size
`
tests['hash-size'].run = suite('hash-size', () => {
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

tests['hash-entries'] = {}
tests['hash-entries'].docs = `
## hash-entries

Test that hash-entries
`
tests['hash-entries'].run = suite('hash-entries', () => {
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

module.exports = tests
