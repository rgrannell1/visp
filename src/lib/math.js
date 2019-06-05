
const calleable = require('../calleable')

const defs = {}

defs.sum = (nums) => {
  return nums.reduce((a, b) => {
    return a + b
  }, 0)
}

defs.product = (nums) => {
  return nums.reduce((a, b) => {
    return a * b
  }, 1)
}

const lib = {}

lib['plus'] = calleable.applicative((num0, num1) => num0 + num1)
lib['minus'] = calleable.applicative((num0, num1) => num0 - num1)
lib['times'] = calleable.applicative((num0, num1) => num0 * num1)
lib['over'] = calleable.applicative((num0, num1) => num0 / num1)

lib['sum'] = calleable.applicative(defs.sum)
lib['product'] = calleable.applicative(defs.product)

lib['sum*'] = calleable.applicative((...nums) => {
  return defs.sum(nums)
})
lib['product*'] = calleable.applicative((...nums) => {
  return defs.product(nums)
})

lib['clamp'] = calleable.applicative((min, num, max) => {
  if (num > max) {
    return max
  } else if (num < min) {
    return min
  } else {
    return num
  }
})

module.exports = lib
