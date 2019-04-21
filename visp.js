
const pg = require('./pg')
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
    return pg.success(match, input.slice(match.length))
  } else {
    return pg.failure('number', input)
  }
}

visp.boolean = input => {
  const candidate = input.slice(0, 2)

  if (candidate === '#f' || candidate === '#t') {
    return pg.success(candidate, input.slice(2))
  } else {
    return pg.failure('#t or #f', candidate)
  }
}

visp.string = input => {
  if (input.charAt(0) !== '"') {
    return pg.failure('"', input.charAt(0))
  }

  let included = 1
  while (input.charAt(included) !== '"') {
    if (included === input.length) {
      return pg.failure('terminating "', '"')
    }

    ++included
  }

  return pg.success(input.slice(0, included + 1), input.slice(included + 1))
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
      return pg.failure('valid head character', lead)
    }

    let included = 1
    while (isValidTailChar(input.charAt(included)) && included < input.length) {
      included++
    }

    return pg.success(input.slice(0, included), input.slice(included))
  }
}

visp.eof = input => {
  return input.length === 0
    ? pg.success(null, input)
    : pg.failure('eof', input)
}

visp.expression = input => {
  return visp.oneOf([
    visp.boolean,
    visp.string,
    visp.number,
    visp.identifier
  ])(input)
}

visp.map = (fn, parser) => {
  return (input) => {
    const result = parser(input)
    return result.isFailure
      ? result
      : pg.success(fn(result.data), result.rest)
  }
}

visp.apply = (fn, parsers) => {
  return input => {
    const acc = []
    let current = input

    for (const parser of parsers) {
      const result = parser(current)
      if (result.isFailure) {
        return result
      }

      acc.push(result.data)
      current = input.rest
    }

    return success(fn(...acc), current)
  }
}

visp.collect = parsers => {
  return visp.apply((...results) => results, parsers)
}

visp.oneOf = parsers => {
  return input => {
    for (const parser of parsers) {
      const result = parser(input)

      if (result.isFailure) {
        continue
      }

      return result
    }

    return pg.failure('oneOf', input)
  }
}

module.exports = visp
