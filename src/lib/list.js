
const calleable = require('../calleable')

const lib = {}

lib['list'] = calleable.applicative((...list) => list)

module.exports = lib
