
const calleable = require('../calleable')

const lib = {}

lib['lens-get'] = calleable.applicative((lens, whole) => {
  return lens.get(whole)
})

lib['lens-set'] = calleable.applicative((lens, whole, part) => {
  return lens.set(whole, part)
})

lib['lens-compose'] = calleable.applicative((...lenses) => {

})

lib['at'] = calleable.applicative(num => {
  return {
    get (whole) {
      return whole[num]
    },
    set (whole, part) {
      return whole.slice(0, num).concat([part]).concat(whole.slice(num + 1))
    }
  }
})

lib['get'] = calleable.applicative(keys => {

})

lib['at-key'] = calleable.applicative(key => {
  return {
    get (whole) {
      return whole[key]
    },
    set (whole, part) {
      return Object.assign({}, whole, {
        [key]: part
      })
    }
  }
})

module.exports = lib
