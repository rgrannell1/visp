
const chalk = require('chalk')

const pc = {}
const Parser = {}

const data = {}

Parser.failure = data => {
  if (typeof data === 'undefined') {
    throw new TypeError('Parser.failure recieved undefined parse-data')
  }

  const self = {
    isFailure: true,
    data
  }

  return self
}

Parser.failure.docs = `
## Parser.failure

Construct a failed parse result.
`

Parser.success = (data, rest) => {
  if (typeof data === 'undefined') {
    throw new TypeError('Parser.success recieved undefined parse-data')
  }

  const self = {
    isFailure: false,
    data,
    rest
  }

  return self
}

Parser.success = `
## Parser.success

Construct a successful parse result.
`

Parser.onSuccess = (fn, parser) => {
  const self = input => {
    const result = parser(input)
    return result.isFailure
      ? result
      : Parser.success(fn(result.data), result.rest)
  }

  self.meta = () => {
    return parser.meta()
  }

  return self
}

Parser.onSuccess.docs = `
## Parser.onSuccess
`

Parser.all = parsers => {
  const self = input => {
    const acc = []
    let current = input

    for (const parser of parsers) {
      const result = parser(current)
      if (result.isFailure) {
        return result
      }

      acc.push(result.data)
      current = result.rest
    }

    return Parser.success(acc, current)
  }

  self.meta = () => {
    const metas = parsers.map(parser => {
      return `- ${parser.meta().description}`
    })

    return {
      description: `a sequence of:\n${metas.join('\n')}`
    }
  }

  return self
}

Parser.all.docs = `
## Parser.all
`

Parser.extract = (junk, parser) => {
  return Parser.onSuccess(([junk0, data, junk1]) => {
    return data
  }, Parser.all([junk, parser, junk]))
}

Parser.extract.docs = `
## Parser.extract

`

Parser.oneOf = parsers => {
  const self = input => {
    for (const parser of parsers) {
      const result = parser(input)

      if (result.isFailure) {
        continue
      }

      if (result.isFailure === false && result.data === undefined) {
        throw new Error('undefined data returned from parser')
      }

      return result
    }

    return Parser.failure({
      message: `I could not parse the input with any of the supplied choice of parsers`
    })
  }

  self.meta = () => {
    return {
      description: 'merp'
    }
  }

  return self
}

Parser.oneOf.docs = `
## Parser.oneOf

`

Parser.character = char => {
  return input => {
    if (typeof input === 'undefined') {
      return Parser.failure({
        message: `I could not parse the character, as I recieved an undefined input`
      })
    }

    if (input.length === 0) {
      return Parser.failure({
        message: `I could not parse the character, as I expected "${char}" but recieved an empty string`
      })
    }

    return input.charAt(0) === char
      ? Parser.success(char, input.slice(1))
      : Parser.failure({
          message: `I could not parse the character, as I expected "${char}" but recieved ${input.charAt(0)}`
        })
  }
}

Parser.character.docs = `
## Parser.character

Receives a character. Returns a parser that attempts to parse
`

Parser.optional = parser => {
  return input => {
    const result = parser(input)

    if (result.isFailure) {
      return Parser.success(null, input)
    } else {
      return result
    }
  }
}

Parser.optional.docs = `
## Parser.optional

`

Parser.many1 = parser => {
  const self = input => {
    const acc = []
    let result = {isFailure: false, rest: input}

    let rest = input
    let wasMatched = false

    while (true) {
      result = parser(result.rest)

      if (result.isFailure) {
        break
      } else {
        acc.push(result.data)
        rest = result.rest
        wasMatched = true
      }
    }

    if (wasMatched) {
      return Parser.success(acc, rest)
    } else {
      return Parser.failure({
        message: `I could not parse the input once. Expected ${parser.meta().description}`,
      })
    }
  }

  self.meta = () => {
    return {
      description: `One or more inputs matching ${parser.meta().description}`
    }
  }

  return self
}

Parser.many1.docs = `
## Parser.many1

`

Parser.report = failure => {
  let message = chalk.blue('-- PARSING ERROR -----------------------------------------\n\n')

  if (failure.data && failure.data.message) {
    message += failure.data.message
    message += '\n'
  }

  console.log(message)
}

Parser.report.docs = `
## Parser.report

`

Parser.run = (parser, input) => {
  const result = parser(input)
  if (!result) {
    throw new SyntaxError(`Parser didn't return a result.`)
  }
  if (result.isFailure) {
    throw new SyntaxError(result.data.message)
  } else {
    return result
  }
}

Parser.run.docs = `
## Parser.run

`

module.exports = {Parser, pc}
