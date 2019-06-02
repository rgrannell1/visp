
const {expect} = require('chai')
const chalk = require('chalk')
const utils = require('./utils')

const {Parser} = require('../src/pc')
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

const runParser = Parser.run

demand.error = (thunk, ctr) => {
  inspectError(thunk, isError(ctr))
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

suite('visp.parse.number', () => {
  demand.error(() => runParser(visp.parse.number, '.10'), SyntaxError)
  demand.error(() => runParser(visp.parse.number, '10.10.10'), SyntaxError)

  const pairs = [
    ['+10.01', 10.01],
    ['-127.05', -127.05],
    ['0', 0],
    ['1', 1],
    ['12', 12]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => runParser(visp.parse.number, str), utils.ast.number(value))
  }
})

suite('visp.parse.boolean', () => {
  demand.error(() => runParser(visp.parse.boolean, '#nope'), SyntaxError)

  demand.cases('boolean', [
    ['#t', utils.ast.boolean(true)],
    ['#f', utils.ast.boolean(false)]
  ])
})

suite('visp.parse.string', () => {
  demand.error(() => runParser(visp.parse.string, '"unterminated '), SyntaxError)

  demand.cases('string', [
    ['"a string"', utils.ast.string('a string')]
    // -- todo add inner string support.
  ])
})

suite('visp.parse.symbol', () => {
  demand.error(() => runParser(visp.parse.symbol, '#'), SyntaxError)

  demand.cases('symbol', [
    ['define!', utils.ast.symbol('define!')],
    ['$vau', utils.ast.symbol('$vau')],
    ['private', utils.ast.symbol('private')],
    ['my-fn-is-dashed', utils.ast.symbol('my-fn-is-dashed')]
  ])
})

suite('visp.parse.keyword', () => {
  demand.error(() => runParser(visp.parse.keyword, '#'), SyntaxError)

  demand.cases('keyword', [
    ['#ignore', utils.ast.keyword('#ignore')],
    ['#enum', utils.ast.keyword('#enum')]
  ])
})

suite('visp.parse.call', () => {
  const pairs = [
    [
      'some-fn!()',
      utils.ast.call('sone-fn!', [])
    ],
    [
      '$somefn!("a" 1 #t)',
      utils.ast.call('$somefn!', [
        utils.ast.string('a'),
        utils.ast.number(1),
        utils.ast.boolean(true),
      ])
    ]
  ]

  demand.cases('call', pairs)
})

suite('visp.parse.list', () => {
  const list = {type: 'symbol', value: 'list'}

  const pairs = [
    [
      '()',
      utils.ast.call('list', [])
    ],
    [
      '(1 2 3)',
      utils.ast.call('list', [
        utils.ast.number(1),
        utils.ast.number(2),
        utils.ast.number(3),
      ])
    ],
    [
      '(())',
      utils.ast.call('list', [
        utils.ast.call(list, [])
      ])
    ]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => runParser(visp.parse.list, str), value)
  }
})

console.log(chalk.green('test-cases passed.'))
