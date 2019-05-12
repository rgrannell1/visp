
const calleable = require('../calleable')

const lib = {}

lib['list'] = calleable.applicative((...list) => list)
lib['list?'] = calleable.applicative(val => Array.isArray(val))
lib['list-reverse'] = calleable.applicative((...list) => list.reverse())

lib['all-of?'] = calleable.applicative((fn, list) => {
  return list.every(elem => {
    return fn.underlying(elem) === true
  })
})

lib['all-of*?'] = calleable.applicative((fn, ...list) => {
  return list.every(elem => {
    return fn.underlying(elem) === true
  })
})

lib['any-of?'] = calleable.applicative((fn, list) => {
  return list.some(elem => {
    return fn.underlying(elem) === true
  })
})

lib['any-of*?'] = calleable.applicative((fn, ...list) => {
  return list.some(elem => {
    return fn.underlying(elem) === true
  })
})

lib['map'] = calleable.applicative((fn, ...list) => {
  return list.map(elem => {
    return fn.underlying(elem)
  })
})

lib['map*'] = calleable.applicative((fn, ...list) => {
  return list.map(elem => {
    return fn.underlying(elem)
  })
})

lib['select'] = calleable.applicative((fn, list) => {
  return list.filter(elem => {
    return fn.underlying(elem) === true
  })
})

lib['select*'] = calleable.applicative((fn, ...list) => {
  return list.filter(elem => {
    return fn.underlying(elem) === true
  })
})

lib['reject'] = calleable.applicative((fn, list) => {
  return list.filter(elem => {
    return fn.underlying(elem) === false
  })
})

lib['reject*'] = calleable.applicative((fn, ...list) => {
  return list.filter(elem => {
    return fn.underlying(elem) === false
  })
})

lib['fold'] = calleable.applicative((fn, list, initial) => {
  if (initial === 'undefined') {
    throw new TypeError('no initial state passed to fold!')
  }
  return list.reduce((acc, current) => {
    return fn(acc, current)
  })
})

module.exports = lib
