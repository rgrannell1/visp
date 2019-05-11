
const calleable = require('../calleable')

const lib = {}

lib['hash'] = calleable.applicative(parts => {
  const data = {}

  for (const part of parts) {
    data[part[0]] = part[1]
  }

  return data
})

lib['hash-join'] = calleable.applicative((...hashes) => {
  return Object.assign({}, ...hashes)
})

lib['hash-keys'] = calleable.applicative(hash => {
  return Object.keys(hash)
})

lib['hash-values'] = calleable.applicative(hash => {
  return Object.values(hash)
})

lib['hash-size'] = calleable.applicative(hash => {
  return Object.values(hash).length
})

lib['hash-entries'] = calleable.applicative(hash => {
  return Object.entries(hash)
})

module.exports = lib
