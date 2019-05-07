
const visp = require('./src/visp')

const prog = `
$define!(x, 1)
$define!(y, 2)

show(plus(x, plus(y, y)))`

const ast = visp.parse.program(prog)

console.log(visp.parse.deparse(ast))

const result = visp.eval(ast)

console.log('done')
