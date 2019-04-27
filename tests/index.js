
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

demand.cases = (fnName, pairs) => {
 for (const [str, value] of pairs) {
    demand.data(() => pc.run(visp.parser[fnName], str), value)
  }
}

suite('visp.parser.number', () => {
  demand.error(() => pc.run(visp.parser.number, '.10'), SyntaxError)
  demand.error(() => pc.run(visp.parser.number, '10.10.10'), SyntaxError)

  const pairs = [
    ['+10.01', 10.01],
    ['-127.05', -127.05],
    ['0', 0],
    ['1', 1],
    ['12', 12]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => pc.run(visp.parser.number, str), {type: 'number', value})
  }
})

suite('visp.parser.boolean', () => {
  demand.error(() => pc.run(visp.parser.boolean, '#nope'), SyntaxError)

  demand.cases('boolean', [
    ['#t', {type: 'boolean', value: true}],
    ['#f', {type: 'boolean', value: false}]
  ])
})

suite('visp.parser.string', () => {
  demand.error(() => pc.run(visp.parser.string, '"unterminated '), SyntaxError)

  demand.cases('string', [
    ['"a string"', {type: 'string', value: 'a string'}]
    // -- todo add inner string support.
  ])
})

suite('visp.parser.symbol', () => {
  demand.error(() => pc.run(visp.parser.symbol, '#'), SyntaxError)

  demand.cases('symbol', [
    ['define!', {type: 'symbol', value: 'define!'}],
    ['$vau', {type: 'symbol', value: '$vau'}],
    ['private', {type: 'symbol', value: 'private'}],
    ['my-fn-is-dashed', {type: 'symbol', value: 'my-fn-is-dashed'}]
  ])
})

suite('visp.parser.keyword', () => {
  demand.error(() => pc.run(visp.parser.keyword, '#'), SyntaxError)

  demand.cases('keyword', [
    ['#ignore', {type: 'keyword', value: '#ignore'}],
    ['#enum', {type: 'keyword', value: '#enum'}]
  ])
})

suite('visp.parser.call', () => {
  const pairs = [
    [
      'some-fn!()',
      {
          type: 'call',
          fn: {type: 'symbol', value: 'some-fn!'},
          arguments: []
        }
    ],
    [
      '$somefn!("a" 1 #t)',
      {
        type:'call',
        fn: {
          type: 'symbol', value: '$somefn!'
        },
        arguments: [
          { type: 'string', value: 'a' },
          { type: 'number', value: 1 },
          { type: 'boolean', value: true }
        ]
      }
    ]
  ]

  demand.cases('call', pairs)
})

suite('visp.parser.list', () => {
  const list = {type: 'symbol', value: 'list'}

  const pairs = [    ['()', {type: 'call', fn: list, arguments: [  ]}],
    ['(1 2 3)', {type: 'call', fn: list, arguments: [
      {value: 1, type: 'number'},
      {value: 2, type: 'number'},
      {value: 3, type: 'number'},
    ]}],
    ['(())', {type: 'call', fn: list, arguments: [
      {
        type: "call",
        fn: list,
        arguments: []
      }
    ]}]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => pc.run(visp.parser.list, str), value)
  }
})

console.log(chalk.green('test-cases passed.'))
