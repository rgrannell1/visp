
const pc = require('./pc')
const ast = require('./ast')
const constants = require('./constants')

/*

  <expression> -> <expression> <expression>
               -> <identifier ( <expression> )
               -> <string>
               -> <number>
               -> <boolean>

  <boolean>    -> #t
               -> #f

  <inert>      -> #inert

  <number>     -> <digit>
               -> <digit><digit>

  <double>     -> <number>
               -> <sign> <number>
               -> <number> . <number>
               -> <sign> <number> . <number>

  <identifier> -> <start_char> <trail_char> ...

 */

const parser = {}

parser.number = function number (input) {
  const matches = constants.regexp.number.exec(input)

  if (matches) {
    let match = matches[0]
    return pc.success(ast.number(match), input.slice(match.length))
  } else {
    return pc.failure('number', input)
  }
}

parser.boolean = function boolean (input) {
  const candidate = input.slice(0, 2)

  if (candidate === '#f' || candidate === '#t') {
    return pc.success(ast.boolean(candidate), input.slice(2))
  } else {
    return pc.failure('#t or #f', candidate)
  }
}

parser.inert = function inert (input) {
  const candidate = input.slice(0, 6)

  if (candidate === '#inert') {
    return pc.success(ast.inert(candidate), input.slice(6))
  } else {
    return pc.failure('#inert', candidate)
  }
}

parser.string = function string (input) {
  if (input.charAt(0) !== '"') {
    return pc.failure('"', input.charAt(0))
  }

  let included = 1
  while (input.charAt(included) !== '"') {
    if (included === input.length) {
      return pc.failure('terminating "', '"')
    }

    ++included
  }

  return pc.success(ast.string(input.slice(0, included + 1)), input.slice(included + 1))
}

const contains = set => char => set.includes(char)

const identifier = ({isValidHeadChar, isValidTailChar, parser}) => input => {
  const lead = input[0]

  if (!isValidHeadChar(lead)) {
    return pc.failure('valid head character', lead)
  }

  let included = 1
  while (isValidTailChar(input.charAt(included)) && included < input.length) {
    included++
  }

  return pc.success(ast[parser](input.slice(0, included)), input.slice(included))
}

parser.symbol = identifier({
  isValidHeadChar: contains('$' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'),
  isValidTailChar: contains('-!?' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'),
  parser: 'symbol'
})

parser.keyword = identifier({
  isValidHeadChar: contains('#'),
  isValidTailChar: contains('-!?' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'),
  parser: 'keyword'
})

parser.eof = function eof (input) {
  return input.length === 0
    ? pc.success(null, input)
    : pc.failure('eof', input)
}

{
  const spaceChars = new Set([' ', '  ', ',', '\n'])

  parser.whitespace = function whitespace (input) {
    if (input === undefined) {
      throw new TypeError('undefined value supplied.')
    }

    let included = 0

    while (spaceChars.has(input.charAt(included)) && included < input.length - 1) {
      included++
    }

    return pc.success(input.slice(0, included), input.slice(included))
  }
}

parser.expression = function expression (input) {
  const part = pc.oneOf([
    parser.call,
    parser.list,
    parser.boolean,
    parser.inert,
    parser.string,
    parser.number,
    parser.symbol,
    parser.keyword
  ])

  const whitespaceIgnore = pc.extractFrom(parser.whitespace)(part)
  return pc.many(whitespaceIgnore)(input)
}

parser.program = function program (input) {
  const prs = pc.collect([
    pc.many(parser.expression),
    parser.whitespace,
    parser.eof
  ])

  return pc.map(ast.program, prs)(input)
}

parser.deparse = function stringify (ast) {
  if (ast.data && ast.data.type === 'program') {
    return parser.deparse(ast.data)
  }

  if (ast.type === 'program') {
    return ast.expressions.map(parser.deparse).join('\n')
  } else if (ast.type === 'call') {
    const args = ast.arguments.map(parser.deparse).join(', ')
    return `${ast.fn.value}(${args})`
  } else if (ast.type === 'symbol') {
    return ast.value
  } else if (ast.type === 'number') {
    return ast.value
  } else if (ast.type === 'string') {
    return ast.value
  }
  else {
    throw new Error(`unsupported value: ${JSON.stringify(ast, null, 2)}`)
  }
}

parser.list = function list (input) {
  const listParser = pc.extractFrom(parser.whitespace)(pc.collect([
    pc.char('('),
    parser.expression,
    pc.char(')')
  ]))

  return pc.map(ast.list, listParser)(input)
}

parser.call = function call (input) {
  const callParser = pc.extractFrom(parser.whitespace)(pc.collect([
    parser.symbol,
    pc.char('('),
    parser.expression,
    pc.char(')')
  ]))

  return pc.map(ast.call, callParser)(input)
}

module.exports = parser
