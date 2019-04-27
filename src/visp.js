
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

  <number>     -> <digit>
               -> <digit><digit>

  <double>     -> <number>
               -> <sign> <number>
               -> <number> . <number>
               -> <sign> <number> . <number>

  <identifier> -> <start_char> <trail_char> ...

 */

const visp = {
  parser: {}
}

visp.parser.number = function number (input) {
  const matches = constants.regexp.number.exec(input)

  if (matches) {
    let match = matches[0]
    return pc.success(ast.number(match), input.slice(match.length))
  } else {
    return pc.failure('number', input)
  }
}

visp.parser.boolean = function boolean (input) {
  const candidate = input.slice(0, 2)

  if (candidate === '#f' || candidate === '#t') {
    return pc.success(ast.boolean(candidate), input.slice(2))
  } else {
    return pc.failure('#t or #f', candidate)
  }
}

visp.parser.string = function string (input) {
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

visp.parser.symbol = identifier({
  isValidHeadChar: contains('$' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'),
  isValidTailChar: contains('-!?' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'),
  parser: 'symbol'
})

visp.parser.keyword = identifier({
  isValidHeadChar: contains('#'),
  isValidTailChar: contains('-!?' + 'abcdefghijklmnopqrstuvwxyz' + '0123456789'),
  parser: 'keyword'
})

visp.parser.eof = function eof (input) {
  return input.length === 0
    ? pc.success(null, input)
    : pc.failure('eof', input)
}

{
  const spaceChars = new Set([' ', '  ', ',', '\n'])

  visp.parser.whitespace = function whitespace (input) {
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

visp.parser.expression = function expression (input) {
  const part = pc.oneOf([
    visp.parser.call,
    visp.parser.list,
    visp.parser.boolean,
    visp.parser.string,
    visp.parser.number,
    visp.parser.symbol,
    visp.parser.keyword
  ])

  const whitespaceIgnore = pc.extractFrom(visp.parser.whitespace)(part)
  return pc.many(whitespaceIgnore)(input)
}

visp.parser.list = function list (input) {
  const listParser = pc.extractFrom(visp.parser.whitespace)(pc.collect([
    pc.char('('),
    visp.parser.expression,
    pc.char(')')
  ]))

  return pc.map(ast.list, listParser)(input)
}

visp.parser.call = function call (input) {
  const callParser = pc.extractFrom(visp.parser.whitespace)(pc.collect([
    visp.parser.symbol,
    pc.char('('),
    visp.parser.expression,
    pc.char(')')
  ]))

  return pc.map(ast.call, callParser)(input)
}

visp.evaluate = require('./evaluate')

module.exports = visp
