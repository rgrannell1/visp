
const chalk = require('chalk')

require('./parser')
require('./stdlib/functionals')
require('./stdlib/hash')
require('./stdlib/imports')
require('./stdlib/lens')
require('./stdlib/list')
require('./stdlib/math')
require('./stdlib/set')
require('./stdlib/symbol')

console.log(chalk.green('test-cases passed.'))
