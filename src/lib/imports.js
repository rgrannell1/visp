
const calleable = require('../calleable')

const lib = {}

lib['require'] = calleable.applicative((path) => {
  return require(path)
})

module.exports = lib
