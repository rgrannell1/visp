
const calleable = require('../calleable')

const lib = {}

lib['symbol'] = calleable.applicative(description => {
  return Symbol(description)
})

lib['symbol?'] = calleable.applicative(val => {
  return typeof val === 'symbol'
})

module.exports = lib
