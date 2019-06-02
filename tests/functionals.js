
const {expect} = require('chai')
const visp = require('../src/visp')
const {demand, suite, evaluate} = require('./utils')

suite('identity', () => {
  expect(evaluate('identity(10)')).to.equal(10)
})

suite('truth', () => {
  expect(evaluate('truth?()')).to.equal(true)
})

suite('falsity', () => {
  expect(evaluate('falsity?()')).to.equal(false)
})
