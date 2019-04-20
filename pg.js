
const pg = {}

const data = {}

pg.failure = (expected, actual) => {
  return {isFailure: true, expected, actual}
}

pg.success = (data, rest) => {
  return {isFailure: false, data, rest}
}

pg.run = (parser, input) => {
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

pg.always = val => {}
pg.never = val => {}
pg.bind = (parser, fn) => {}
pg.seq = (...parsers) => {}
pg.attempt = (parser) => {}
pg.look = (parser) => {}
pg.choice = (...parsers) => {}
pg.optional = (parser, dft) => {}
pg.expected = (parser, message) => {}
pg.many = (parser) => {}
pg.enum = (...parsers) => {}

module.exports = pg