
const calleable = require('../calleable')

const lib = {}

lib['symbol'] = calleable.applicative(description => {
  return new Symbol(description)
})

module.exports = lib
