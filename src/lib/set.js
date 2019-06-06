
const calleable = require('../calleable')

const lib = {}

lib['set'] = calleable.applicative(parts => new Set(parts))

lib['set*'] = calleable.applicative((...parts) => new Set(parts))

lib['set-equal'] = calleable.applicative((set0, set1) => {
  if (set0.size !== set1.size) {
    return false
  }

  for (const elem of set0) {
    if (!set1.has(elem)) {
      return false
    }
  }

  return true
})

lib['set-has'] = calleable.applicative((set, elem) => {
  return set.has(elem)
})

module.exports = lib
