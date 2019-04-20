
const {expect} = require('chai')

const pg = require('../pg')
const visp = require('../visp')

const demand = {}

const inspectError = (thunk, onError) => {
  try {
    thunk()
  } catch (err) {
    onError(err)
  }
}

const isError = (ctr, message = null) => err => {
  const isRightClass = err instanceof ctr

  if (!isRightClass) {
    throw new Error(`Invalid error class. Expected ${ctr.name}, got ${err.name} (${err.message})`)
  }
}

demand.error = (thunk, ctr) => {
  inspectError(thunk, isError(ctr))
}

demand.error(() => pg.run(visp.integer, '.10'), SyntaxError)

console.log(pg.run(visp.integer, '10.01 asdasdasdasdasdasd'))

console.log('passed!')
