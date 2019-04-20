
const pg = require('./pg')
const constants = require('./constants')

const visp = {}

{
  let startChars = new Set([...constants.charSets.numbers, '+', '-'])

  visp.integer = input => {
    const matches = constants.regexp.number.exec(input)

    if (matches) {
      let match = matches[0]
      return pg.success(match, input.slice(match.length))
    }
  }
}

module.exports = visp
