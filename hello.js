
const visp = require('./src/visp')

const prog = `
$define!(x, 1)
$define!(y, 2)

$define!(is-x-symbol, is-symbol?(x))
$define!(is-y-symbol, is-symbol?(y))`

const ast = visp.parse.program(prog)

console.log(visp.parse.deparse(ast))

const result = visp.eval(ast)

console.log('done')
