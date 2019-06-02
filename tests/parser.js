
const {expect} = require('chai')
const utils = require('./utils')
const {demand, suite} = require('./utils')

const {Parser} = require('../src/pc')
const visp = require('../src/visp')

const runParser = Parser.run

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
      utils.ast.call('some-fn!', [])
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
        utils.ast.call('list', [])
      ])
    ]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => runParser(visp.parse.list, str), value)
  }
})

suite('visp.parse.comment', () => {
  const pairs = [
    [
      '; test comment\n',
      utils.ast.comment('; test comment')
    ]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => runParser(visp.parse.comment, str), value)
  }
})

suite('visp.parse.inert', () => {
  const pairs = [
    [
      '#inert',
      utils.ast.inert()
    ]
  ]

  for (const [str, value] of pairs) {
    demand.data(() => runParser(visp.parse.inert, str), value)
  }
})

suite('visp.parse.infix', () => {

})

suite('visp.parse.expression', () => {

})
