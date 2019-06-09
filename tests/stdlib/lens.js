
const {expect} = require('chai')
const visp = require('../../src/visp')
const {demand, suite, evaluate} = require('../utils')

const tests = {}

tests['$pipe'] = {}
tests['$pipe'].docs = `

`
tests['$pipe'].run = suite('$pipe', () => {
  const parts = [
    [
      `x <- $pipe(require('fs'))
       x
      `,
      require('fs')
    ]
  ]

  for (const [program, result] of parts) {

    console.log(evaluate("x <- $pipe(require('fs'))"))

//    expect(evaluate(program)).to.deep.equal(result)
  }
})

module.exports = tests
