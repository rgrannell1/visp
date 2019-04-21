
const {expect} = require('chai')

const pc = require('../pc')
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
    throw new Error(`Invalid error class. Expected ${ctr.name} got ${err.name} (${err.message})`)
  }
}

demand.error = (thunk, ctr) => {
  inspectError(thunk, isError(ctr))
}

demand.data = (thunk, data) => {
  const actual = thunk().data

  expect(actual).to.deep.equal(data)
}

demand.error(() => pc.run(visp.number, '.10'), SyntaxError)
demand.error(() => pc.run(visp.number, '10.10.10'), SyntaxError)
demand.error(() => pc.run(visp.boolean, '#nope'), SyntaxError)
demand.error(() => pc.run(visp.string, '"unterminated '), SyntaxError)
demand.error(() => pc.run(visp.identifier, '#'), SyntaxError)

demand.data(() => pc.run(visp.expression, '#t'), ['#t'])
demand.data(() => pc.run(visp.expression, '#f'), ['#f'])
demand.data(() => pc.run(visp.expression, '$sym'), ['$sym'])
demand.data(() => pc.run(visp.expression, '"a string"'), ['"a string"'])

demand.data(() => pc.run(visp.expression, '  "a string" '), ['"a string"'])
demand.data(() => pc.run(visp.expression, '  \n#t '), ['#t'])

demand.data(() => pc.run(visp.expression, '  "a string" "a string" +10.1 #f'), [ '"a string"', '"a string"', '+10.1', '#f' ])

let cd = pc.run(visp.identifier, '$$')

console.log(cd)
console.log('passed.')
