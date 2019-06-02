
const {pc, Parser} = require('./pc')
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

parser.comment = function comment(input) {
  if (input.charAt(0) !== ';') {
    return Parser.failure({
      message: `I could not parse the comment, the first character was "${input.charAt(0)}" but I expected ";"`
    })
  }

  let includes = 0
  while (input.charAt(includes) !== '\n') {
    if (includes > input.length) {
      return Parser.failure({
        message: `I could not parse the comment, as the input ended before it reached a \\n newline character`
      })
    }
    ++includes
  }

  return Parser.success(ast.comment(input.slice(0, includes)), input.slice(includes))
}

parser.comment.meta = () => {
  return {
    description: 'a comment beginning with a semicolon and ending with a newline'
  }
}

parser.number = function number(input) {
  const matches = constants.regexp.number.exec(input)

  if (matches) {
    let match = matches[0]
    return Parser.success(ast.number(match), input.slice(match.length))
  } else {
    return Parser.failure({
      message: `I could not parse the number, as a number should match the regular expression "${constants.regexp.number}" but didn't\n\n` +
        `for example, some valid numbers are:` +
        ['0', '+1', '-1', '-10.5', '10.5', '+10.5'].join('\n')
    })
  }
}
parser.number.meta = () => {
  return {
    description: 'a decimal number with an optional plus or minus sign'
  }
}

parser.boolean = function boolean(input) {
  const candidate = input.slice(0, 2)

  if (candidate === '#f' || candidate === '#t') {
    return Parser.success(ast.boolean(candidate), input.slice(2))
  } else {
    return Parser.failure({
      message: `I could not parse the Boolean value, which should be either "#t" or "#f" but was "${candidate}"`
    })
  }
}
parser.boolean.meta = () => {
  return {
    description: 'a boolean literal #t or #f'
  }
}

parser.inert = function inert(input) {
  const candidate = input.slice(0, 6)

  if (candidate === '#inert') {
    return Parser.success(ast.inert(candidate), input.slice(6))
  } else {
    return Parser.failure({
      message: `I could not parse the inert value, which should be "#inert" but was "${candidate}"`
    })
  }
}
parser.inert.meta = () => {
  return {
    description: 'an inert value #inert'
  }
}

{
  const ops = new Set([
    '<-'
  ])

  parser.infix = function infix (input) {
    for (const op of ops) {
      if (input.startsWith(op)) {
        return Parser.success(op, input.slice(op.length))
      }
    }

    return Parser.failure({
      message: `I could not parse the infix binary operator, which should be in the list ${ [...ops].map(op => `"${op}"`).join(', ') }`
    })
  }

  parser.infix.meta = () => {
    return {
      description: 'a binary operator'
    }
  }
}

parser.string = function string(input) {
  if (input.charAt(0) !== '"') {
    return Parser.failure({
      message: `I could not parse the string, which should begin with " but was ${input.charAt(0)}`
    })
  }

  let included = 1
  while (input.charAt(included) !== '"') {
    if (included === input.length) {
      return Parser.failure({
        message: `I could not parse the string, as the input ended before it reached a closing "`
      })
    }

    ++included
  }

  return Parser.success(ast.string(input.slice(0, included + 1)), input.slice(included + 1))
}

parser.string.meta = () => {
  return {
    description: 'a double-quoted string of characters'
  }
}

const contains = set => char => set.includes(char)

const identifier = ({ isValidHeadChar, isValidTailChar, parser }) => input => {
  const lead = input[0]

  if (!isValidHeadChar(lead)) {
    return Parser.failure('valid head character', lead)
  }

  let included = 1
  while (isValidTailChar(input.charAt(included)) && included < input.length) {
    included++
  }

  return Parser.success(ast[parser](input.slice(0, included)), input.slice(included))
}

{
  const alpha = 'abcdefghijklmnopqrstuvwxyz'

  parser.symbol = identifier({
    isValidHeadChar: contains('$' + alpha + alpha.toUpperCase() + '0123456789'),
    isValidTailChar: contains('-!?*' + alpha + alpha.toUpperCase() + '0123456789'),
    parser: 'symbol'
  })

  parser.symbol.meta = () => {
    return {
      description: 'a variable name'
    }
  }

  parser.keyword = identifier({
    isValidHeadChar: contains('#'),
    isValidTailChar: contains('-!?*' + alpha + alpha.toUpperCase() + '0123456789'),
    parser: 'keyword'
  })

  parser.keyword.meta = () => {
    return {
      description: 'a keyword beginning with #'
    }
  }

}

parser.eof = function eof(input) {
  return input.length === 0
    ? Parser.success(null, input)
    : Parser.failure({
        message: "I could not parse the input as the end of a string, as it wasn't empty"
      })
}

parser.symbol.meta = () => {
  return {
    description: 'an empty string'
  }
}

{
  const spaceChars = new Set([' ', '  ', ',', '\n'])

  parser.whitespace = function whitespace(input) {
    if (input === undefined) {
      throw new TypeError('undefined value supplied.')
    }
    let included = 0

    while (spaceChars.has(input.charAt(included)) && included < input.length - 1) {
      included++
    }

    return Parser.success(input.slice(0, included), input.slice(included))
  }

  parser.whitespace.meta = () => {
    return {
      description: 'ignored spaces, tabs, newlines, and commas'
    }
  }
}

parser.expression = function expression(input) {
  const part = Parser.oneOf([
    parser.binaryCall,
    parser.call,
    parser.list,
    parser.boolean,
    parser.inert,
    parser.string,
    parser.number,
    parser.comment,
    parser.symbol,
    parser.keyword
  ])

  return Parser.many1(Parser.extract(parser.whitespace, part))(input)
}

parser.expression.meta = () => {
  return {
    description: 'a visp expression, which may be a:\n' +
      [
        '  * binary operator call',
        '  * function call',
        '  * list',
        '  * boolean value',
        '  * inert value',
        '  * a double-quoted string of characters',
        '  * a decimal number, with an optional plus or minus sign',
        '  * a comment',
        '  * a variable name',
        '  * a keyword',
      ].join('\n')
  }
}


parser.program = function program(input) {
  const whitespaceIgnore = Parser.extract(parser.whitespace, Parser.many1(parser.expression))
  return Parser.onSuccess(ast.program, Parser.many1(whitespaceIgnore))(input)
}


parser.program.meta = () => {
  return {
    description: 'a valid visp program'
  }
}

parser.deparse = function stringify(ast) {
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
  } else if (ast.hasOwnProperty('isFailure')) {
    throw new Error(`parse result passed to deparse!: ${JSON.stringify(ast, null, 2)}`)
  }
  else {
    throw new Error(`cannot deparse value: ${JSON.stringify(ast, null, 2)}`)
  }
}

parser.list = function list(input) {
  const listParser = Parser.extract(parser.whitespace, Parser.all([
    Parser.character('('),
    Parser.optional(parser.expression),
    Parser.character(')')
  ]))

  return Parser.onSuccess(ast.list, listParser)(input)
}

parser.list.meta = () => {
  return {
    description: 'a list of expressions'
  }
}

parser.call = function call(input) {
  const callParser = Parser.extract(parser.whitespace, Parser.all([
    parser.symbol,
    Parser.character('('),
    Parser.optional(parser.expression),
    Parser.character(')')
  ]))

  return Parser.onSuccess(ast.call, callParser)(input)
}

parser.call.meta = () => {
  return {
    description: 'a function call'
  }
}

parser.binaryCall = function binaryCall(input) {
  const expressionPart = Parser.oneOf([
    parser.call,
    parser.list,
    parser.boolean,
    parser.inert,
    parser.string,
    parser.number,
    parser.symbol,
    parser.keyword
  ])

  const binaryParser = Parser.extract(parser.whitespace, Parser.all([
    expressionPart,
    Parser.extract(parser.whitespace, parser.infix),
    expressionPart
  ]))

  return Parser.onSuccess(ast.binaryCall, binaryParser)(input)
}

parser.binaryCall.meta = () => {
  return {
    description: 'a binary operator call'
  }
}

module.exports = parser
