
const calleable = require('../calleable')

const lib = {}

lib['list'] = calleable.applicative((...list) => list)
lib['list?'] = calleable.applicative(val => Array.isArray(val))
lib['list-reverse'] = calleable.applicative((...list) => list.reverse())

module.exports = lib
