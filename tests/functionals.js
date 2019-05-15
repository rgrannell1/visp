
const {expect} = require('chai')
const visp = require('../src/visp')

const evaluate = source => {
  return visp.eval(visp.parse.program(source))
}

expect(evaluate('identity(10)')).to.equal(10)
expect(evaluate('truth?()')).to.equal(true)
expect(evaluate('falsity?()')).to.equal(false)
