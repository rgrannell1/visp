
const {expect} = require('chai')
const utils = require('./utils')
const {demand, suite} = require('./utils')

const {Parser} = require('../src/pc')
const visp = require('../src/visp')

const runParser = Parser.run

const tests = {}

tests['visp.parse.number'] = {}
tests['visp.parse.number'].docs = `
## visp.parse.number

Test that visp.parse.number
`
tests['visp.parse.number'].run = suite('visp.parse.number', () => {
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

tests['visp.parse.boolean'] = {}
tests['visp.parse.boolean'].docs = `
## visp.parse.boolean

Test that visp.parse.boolean
`
tests['visp.parse.boolean'].run = suite('visp.parse.boolean', () => {
  demand.error(() => runParser(visp.parse.boolean, '#nope'), SyntaxError)

  demand.cases('boolean', [
    ['#t', utils.ast.boolean(true)],
    ['#f', utils.ast.boolean(false)]
  ])
})

tests['visp.parse.string'] = {}
tests['visp.parse.string'].docs = `
## visp.parse.string

Test that visp.parse.string
`
tests['visp.parse.string'].run = suite('visp.parse.string', () => {
  demand.error(() => runParser(visp.parse.string, '"unterminated '), SyntaxError)

  demand.cases('string', [
    ['"a string"', utils.ast.string('a string')]
    // -- todo add inner string support.
  ])
})

tests['visp.parse.symbol'] = {}
tests['visp.parse.symbol'].docs = `
## visp.parse.symbol

Test that visp.parse.symbol
`
tests['visp.parse.symbol'].run = suite('visp.parse.symbol', () => {
  demand.error(() => runParser(visp.parse.symbol, '#'), SyntaxError)

  demand.cases('symbol', [
    ['define!', utils.ast.symbol('define!')],
    ['$vau', utils.ast.symbol('$vau')],
    ['private', utils.ast.symbol('private')],
    ['my-fn-is-dashed', utils.ast.symbol('my-fn-is-dashed')]
  ])
})

tests['visp.parse.keyword'] = {}
tests['visp.parse.keyword'].docs = `
## visp.parse.keyword

Test that visp.parse.keyword
`
tests['visp.parse.keyword'].run = suite('visp.parse.keyword', () => {
  demand.error(() => runParser(visp.parse.keyword, '#'), SyntaxError)

  demand.cases('keyword', [
    ['#ignore', utils.ast.keyword('#ignore')],
    ['#enum', utils.ast.keyword('#enum')]
  ])
})

tests['visp.parse.call'] = {}
tests['visp.parse.call'].docs = `
## visp.parse.call

Test that visp.parse.call
`
tests['visp.parse.call'].run = suite('visp.parse.call', () => {
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

tests['visp.parse.list'] = {}
tests['visp.parse.list'].docs = `
## visp.parse.list

Test that visp.parse.list
`
tests['visp.parse.list'].run = suite('visp.parse.list', () => {
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

tests['visp.parse.comment'] = {}
tests['visp.parse.comment'].docs = `
## visp.parse.comment

Test that visp.parse.comment
`
tests['visp.parse.comment'].run = suite('visp.parse.comment', () => {
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

tests['visp.parse.inert'] = {}
tests['visp.parse.inert'].docs = `
## visp.parse.inert

Test that visp.parse.inert
`
tests['visp.parse.inert'].run = suite('visp.parse.inert', () => {
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

tests['visp.parse.infix'] = {}
tests['visp.parse.infix'].docs = `
## visp.parse.infix

Test that visp.parse.infix
`
tests['visp.parse.infix'].run = suite('visp.parse.infix', () => {

})

tests['visp.parse.expression'] = {}
tests['visp.parse.expression'].docs = `
## visp.parse.expression

Test that visp.parse.expression
`
tests['visp.parse.expression'].run = suite('visp.parse.expression', () => {

})

module.exports = tests
