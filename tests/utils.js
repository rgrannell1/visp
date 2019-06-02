
const {expect} = require('chai')

const {Parser} = require('../src/pc')
const visp = require('../src/visp')

const utils = {}

const ast = {}

ast.symbol = value => {
  return {type: 'symbol', value}
}

ast.number = value => {
  return {type: 'number', value}
}

ast.boolean = value => {
  return {type: 'boolean', value}
}

ast.keyword = value => {
  return {type: 'keyword', value}
}

ast.string = value => {
  return {type: 'string', value}
}

ast.call = (name, arguments) => {
  return {
    type: 'call',
    fn: {type: 'symbol', value: name},
    arguments: arguments
  }
}

utils.ast = ast

utils.isError = (ctr, message = null) => err => {
  const isRightClass = err instanceof ctr

  if (!isRightClass) {
    throw new Error(`Invalid error class. Expected ${ctr.name} got ${err.name} (${err.message})`)
  }
}

const demand = {}

const inspectError = (thunk, onError) => {
  try {
    thunk()
  } catch (err) {
    onError(err)
  }
}

const runParser = Parser.run

demand.error = (thunk, ctr) => {
  inspectError(thunk, utils.isError(ctr))
}

demand.data = (thunk, data) => {
  const res = thunk()
  expect(res).to.have.property('data')

  const actual = res.data

  try {
    console.log('ACTUAL:')
    console.log(JSON.stringify(actual, null, 2))
    expect(actual).to.deep.equal(data)
  } catch (err) {
    console.log('EXPECTED:')
    console.log(JSON.stringify(err.expected, null, 2))
    throw new Error('test case failed.')
  }
}

demand.cases = (fnName, pairs) => {
 for (const [str, value] of pairs) {
    demand.data(() => runParser(visp.parse[fnName], str), value)
  }
}

utils.demand = demand

module.exports = utils
