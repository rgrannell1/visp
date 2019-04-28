
const visp = require('./src/visp')

const prog = `
$define(x, 1)
$define(y, 2)

minus(plus(x, y), 2)`

const ast = visp.parse.program(prog)

console.log(visp.parse.stringify(ast))

const result = visp.eval(ast)

console.log('done')
