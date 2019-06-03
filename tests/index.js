
const chalk = require('chalk')

const paths = [
  './parser',
  './stdlib/functionals',
  './stdlib/hash',
  './stdlib/imports',
  './stdlib/lens',
  './stdlib/list',
  './stdlib/math',
  './stdlib/set',
  './stdlib/symbol'
]

for (const path of paths) {
  const tests = require(path)

  for (const data of Object.values(tests)) {
    data.run()
  }
}

console.log(chalk.green('test-cases passed.'))
