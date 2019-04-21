
const pc = {}

const data = {}

pc.failure = (expected, actual) => {
  return {isFailure: true, expected, actual}
}

pc.success = (data, rest) => {
  return {isFailure: false, data, rest}
}

pc.run = (parser, input) => {
  const result = parser(input)
  if (!result) {
    throw new SyntaxError(`Parser didn't return a result.`)
  }
  if (result.isFailure) {
    throw new SyntaxError(`Parse error. Expected ${result.expected}, got ${result.actual}`)
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

pc.label = (parser, expected) => {
  return input => {
    return result.isFailure
      ? pc.failure(expected, result.actual)
      : result
  }
}

pc.collect = parsers => {
  return pc.apply((...results) => results, parsers)
}

pc.lexeme = junk => {
  return parser => {
    return pc.apply(data => data, [parser, junk])
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

    return pc.failure('oneOf', input)
  }
}

module.exports = pc
