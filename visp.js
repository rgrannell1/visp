
const pc = require('./pc')
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

const visp = {}

visp.number = input => {
  const matches = constants.regexp.number.exec(input)

  if (matches) {
    let match = matches[0]
    return pc.success(match, input.slice(match.length))
  } else {
    return pc.failure('number', input)
  }
}

visp.boolean = input => {
  const candidate = input.slice(0, 2)

  if (candidate === '#f' || candidate === '#t') {
    return pc.success(candidate, input.slice(2))
  } else {
    return pc.failure('#t or #f', candidate)
  }
}

visp.string = input => {
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

  return pc.success(input.slice(0, included + 1), input.slice(included + 1))
}

{

  const isValidHeadChar = char => {
    const isSpecial =
      char === '$' ||
      char === '#'

    const isNormal =
      'abcdefghijklmnopqrstuvwxyz'.includes(char) ||
      '0123456789'.includes(char)

    return isSpecial || isNormal
  }

  const isValidTailChar = char => {

    const isSpecial =
      char === '-'

    const isNormal =
      'abcdefghijklmnopqrstuvwxyz'.includes(char) ||
      '0123456789'.includes(char)

    return isSpecial || isNormal
  }

  visp.identifier = input => {
    const lead = input[0]

    if (!isValidHeadChar(lead)) {
      return pc.failure('valid head character', lead)
    }

    let included = 1
    while (isValidTailChar(input.charAt(included)) && included < input.length) {
      included++
    }

    return pc.success(input.slice(0, included), input.slice(included))
  }
}

visp.eof = input => {
  return input.length === 0
    ? pc.success(null, input)
    : pc.failure('eof', input)
}

{
  const whitespace = new Set([' ', '  ', ',', '\n'])

  visp.whitespace = input => {
    if (input === undefined) {
      throw new TypeError('undefined value supplied.')
    }

    let included = 0

    while (whitespace.has(input.charAt(included)) && included < input.length - 1) {
      included++
    }

    return pc.success(input.slice(0, included), input.slice(included))
  }
}

visp.expression = input => {
  const part = pc.oneOf([
    visp.boolean,
    visp.string,
    visp.number,
    visp.identifier
  ])

  const whitespaceIgnore = pc.lexeme(visp.whitespace)(part)
  return pc.many(whitespaceIgnore)(input)
}

module.exports = visp
