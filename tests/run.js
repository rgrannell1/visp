
const tests = require('./index')

for (const test of tests) {
  for (const data of Object.values(test)) {
    data.run()
  }
}

console.log(chalk.green('test-cases passed.'))
