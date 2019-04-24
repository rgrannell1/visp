
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

const suite = (description, thunk) => {
  console.error(description + '\n')
  thunk()
}

demand.error = (thunk, ctr) => {
  inspectError(thunk, isError(ctr))
}

demand.data = (thunk, data) => {
  const actual = thunk().data

  console.log(actual)
  expect(actual).to.deep.equal(data)
}

suite('visp.number', () => {
  demand.error(() => pc.run(visp.number, '.10'), SyntaxError)
  demand.error(() => pc.run(visp.number, '10.10.10'), SyntaxError)
})

suite('visp.boolean', () => {
  demand.error(() => pc.run(visp.boolean, '#nope'), SyntaxError)
})

suite('visp.string', () => {
  demand.error(() => pc.run(visp.string, '"unterminated '), SyntaxError)
})

suite('visp.identifier', () => {
  demand.error(() => pc.run(visp.identifier, '#'), SyntaxError)
})

suite('visp.call', () => {
  demand.data(() => pc.run(visp.call, 'some-fn!()'), {
    type: 'call',
    fn: 'some-fn!',
    arguments: []
  })

  demand.data(() => pc.run(visp.call, 'somefn("a", 1, #t)'), {
    type:'call',
    fn: 'somefn',
    arguments:['a','1','#t']
  })
})

/*

suite('visp.expression', () => {
  demand.data(() => pc.run(visp.expression, '#t'), ['#t'])
  demand.data(() => pc.run(visp.expression, '#f'), ['#f'])
  demand.data(() => pc.run(visp.expression, '$sym'), ['$sym'])
  demand.data(() => pc.run(visp.expression, '"a string"'), ['"a string"'])

  demand.data(() => pc.run(visp.expression, '  "a string" '), ['"a string"'])
  demand.data(() => pc.run(visp.expression, '  \n#t '), ['#t'])

  demand.data(() => pc.run(visp.expression, '  "a string" "a string" +10.1 #f my-fn("a", 1, b)'), [ '"a string"', '"a string"', '+10.1', '#f' ])
})
*/


console.log('passed.')
