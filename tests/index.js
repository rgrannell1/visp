
const {expect} = require('chai')
const chalk = require('chalk')

const pc = require('../src/pc')
const visp = require('../src/visp')

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
  const message = `AST component: ${description}\n`
  console.log(chalk.blue(message))
  thunk()
}

demand.error = (thunk, ctr) => {
  inspectError(thunk, isError(ctr))
}

demand.data = (thunk, data) => {
  const actual = thunk().data

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

suite('visp.number', () => {
  demand.error(() => pc.run(visp.number, '.10'), SyntaxError)
  demand.error(() => pc.run(visp.number, '10.10.10'), SyntaxError)

  const pairs = [
    ['+10.01', 10.01],
    ['-127.05', -127.05],
    ['0', 0],
    ['1', 1],
    ['12', 12]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => pc.run(visp.number, str), {type: 'number', value})
  }
})

suite('visp.boolean', () => {
  demand.error(() => pc.run(visp.boolean, '#nope'), SyntaxError)

  const pairs = [
    ['#t', true],
    ['#f', false]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => pc.run(visp.boolean, str), {type: 'boolean', value})
  }
})

suite('visp.string', () => {
  demand.error(() => pc.run(visp.string, '"unterminated '), SyntaxError)
})

suite('visp.identifier', () => {
  demand.error(() => pc.run(visp.identifier, '#'), SyntaxError)

  const pairs = [
    'define!',
    '$vau',
    'private',
    'my-fn-is-dashed'
  ]

  for (const value of pairs) {
    demand.data(() => pc.run(visp.identifier, value), {type: 'identifier', value})
  }
})

suite('visp.call', () => {
  demand.data(() => pc.run(visp.call, 'some-fn!()'), {
    type: 'call',
    fn: {
      type: 'identifier', value: 'some-fn!'
    },
    arguments: []
  })
  demand.data(() => pc.run(visp.call, '$somefn!("a" 1 #t)'), {
    type:'call',
    fn: {
      type: 'identifier', value: '$somefn!'
    },
    arguments: [
      { type: 'string', value: 'a' },
      { type: 'number', value: 1 },
      { type: 'boolean', value: true }
    ]
  })
})

suite('visp.list', () => {
  const list = {type: 'identifier', value: 'list'}

  const pairs = [
    ['()', {type: 'call', fn: list, arguments: []}]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => pc.run(visp.list, str), value)
  }
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
