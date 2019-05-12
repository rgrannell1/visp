
const calleable = require('../calleable')

const lib = {}

lib['identity'] = calleable.applicative(val => val)
lib['truth'] = calleable.applicative(val => true)
lib['falsity'] = calleable.applicative(val => false)

module.exports = lib
