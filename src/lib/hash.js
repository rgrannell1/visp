
const calleable = require('../calleable')

const lib = {}

const defs = {}

defs['hash'] = parts => {
  const data = {}

  for (const part of parts) {
    data[part[0]] = part[1]
  }

  return data
}

defs['hash-join'] = (...hashes) => {
  return Object.assign({}, ...hashes)
}

lib['hash'] = calleable.applicative(defs['hash'])
lib['hash*'] = calleable.applicative((...parts) => {
  return defs['hash'](parts)
})

lib['hash-join'] = calleable.applicative(defs['hash-join'])
lib['hash-join*'] = calleable.applicative((...parts) => {
  return defs['hash-join'](parts)
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
