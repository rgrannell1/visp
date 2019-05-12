
require('longjohn');

const fs = require('fs')
const visp = require('./src/visp')

const prog = fs.readFileSync('./hello.vp').toString()

const ast = visp.parse.program(prog)

const result = visp.eval(ast)

console.log('done')
