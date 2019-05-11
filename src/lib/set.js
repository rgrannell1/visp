
const calleable = require('../calleable')

const lib = {}

lib['set'] = calleable.applicative(parts => new Set(parts))

module.exports = lib
