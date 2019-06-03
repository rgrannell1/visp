
const tests = [
  './parser',
  './stdlib/functionals',
  './stdlib/hash',
  './stdlib/imports',
  './stdlib/lens',
  './stdlib/list',
  './stdlib/math',
  './stdlib/set',
  './stdlib/symbol'
].map(path => require(path))

module.exports = tests
