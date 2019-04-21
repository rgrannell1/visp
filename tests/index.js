
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

demand.data = (thunk, data) => {
  const actual = thunk().data
  if (actual !== data) {
    throw new Error(`expected ${data}, got ${actual}`)
  }
}

demand.error(() => pg.run(visp.number, '.10'), SyntaxError)
demand.error(() => pg.run(visp.number, '10.10.10'), SyntaxError)
demand.error(() => pg.run(visp.boolean, '#nope'), SyntaxError)
demand.error(() => pg.run(visp.string, '"unterminated '), SyntaxError)
demand.error(() => pg.run(visp.identifier, '#'), SyntaxError)

demand.data(() => pg.run(visp.expression, '#t'), '#t')
demand.data(() => pg.run(visp.expression, '#f'), '#f')
demand.data(() => pg.run(visp.expression, '$sym'), '$sym')

let cd = pg.run(visp.identifier, '$$')

console.log(cd)
console.log('passed.')
