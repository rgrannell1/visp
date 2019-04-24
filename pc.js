
const pc = {}

const data = {}

pc.failure = (expected, actual, fnName) => {
  return {isFailure: true, expected, actual, fnName}
}

pc.success = (data, rest) => {
  return {isFailure: false, data, rest}
}

pc.givenLength = (parser, min = 1) => {
  return input => {
    if (input.length < min) {
      return pc.failure(`at least ${min} characters`, input.length)
    } else {
      return parser(input)
    }
  }
}

pc.run = (parser, input) => {
  const result = parser(input)
  if (!result) {
    throw new SyntaxError(`Parser didn't return a result.`)
  }
  if (result.isFailure) {
    throw new SyntaxError(`Parse error. Expected ${result.expected} got ${result.actual}`)
  } else {
    return result
  }
}

pc.always = val => {}
pc.never = val => {}
pc.bind = (parser, fn) => {}
pc.seq = (...parsers) => {}
pc.attempt = (parser) => {}
pc.look = (parser) => {}
pc.choice = (...parsers) => {}
pc.optional = (parser, dft) => {}
pc.expected = (parser, message) => {}
pc.many = (parser) => {}
pc.enum = (...parsers) => {}


pc.map = (fn, parser) => {
  return (input) => {
    const result = parser(input)
    return result.isFailure
      ? result
      : pc.success(fn(result.data), result.rest)
  }
}

pc.apply = (fn, parsers) => {
  return input => {
    const acc = []
    let current = input

    for (const parser of parsers) {
      const result = parser(current)
      if (result.isFailure) {
        return result
      }

      const data = result.data

      if (data === undefined) {
        throw new TypeError('data not returned from parser')
      }

      acc.push(data)
      current = result.rest
    }

    return pc.success(fn(...acc), current)
  }
}

pc.collect = parsers => {
  return pc.apply((...results) => results, parsers)
}

pc.extractFrom = junk => {
  return parser => {
    return pc.apply((junk0, data, junk1) => data, [junk, parser, junk])
  }
}

pc.oneOf = parsers => {
  return input => {
    for (const parser of parsers) {
      const result = parser(input)

      if (result.isFailure) {
        continue
      }

      return result
    }

    return pc.failure(`oneOf [${parsers.map(parser => parser.name)}]`, input)
  }
}

pc.char = pc.givenLength(char => {
  return input => {
    if (input === undefined) {
      return pc.failure('a sequence of characters', 'undefined')
    }

    const first = input.charAt(0)
    return first == char
      ? pc.success(char, input.slice(1))
      : pc.failure(`the character ${char}`, `${first} (${first})`)

  }
}, 1)

pc.many = parser => {
  return input => {
    const acc = []
    let result = {isFailure: false, rest: input}

    let rest = input
    let wasMatched = false

    while (!result.isFailure) {
      result = parser(rest)

      if (!result.isFailure) {
        acc.push(result.data)
        rest = result.rest
      } else {
        wasMatched = true
      }
    }

    return wasMatched
      ? pc.success(acc, rest)
      : pc.failed('at least one match', 'no matches')
  }
}

module.exports = pc
