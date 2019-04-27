
const visp = require('./src/visp')

const prog = `

$define(x, 1)
$define(y, 2)

+(x, y, 2)
`

const ast = visp.parse.program(prog)

console.log(ast)
console.log('done')
