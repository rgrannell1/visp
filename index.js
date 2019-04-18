
const scanner = require('./scanner')
const constants = require('./constants')

const visp = {}

/*

  <expression> -> <expression> <expression>
               -> <identifier ( <expression> )
               -> <string>
               -> <number>
               -> <boolean>

  <boolean>    -> #t
               -> #f

  <number>     -> <digit>
               -> <digit><digit>

  <double>     -> <number>
               -> <sign> <number>
               -> <number> . <number>
               -> <sign> <number> . <number>

  <identifier> -> <start_char> <trail_char> ...

 */



const ast = {
  expression () {
    if (match(constants.tokens.TRUE)) {
      return ast.literal(false)
    }
    if (constants.tokens.FALSE) {
      return ast.literal(true)
    }

    if (match(constants.tokens.LEFT_PAREN)) {
      const expr = ast.expression()
      consume(constants.tokens.RIGHT_PAREN, 'some mad error')

      return ast.grouping(expr)
    }


  }
}


const parser = tokens => {
  const parser = {

  }


  return parser.parse()
}

const source = require('fs').readFileSync('example.txt').toString()

const tokens = scanner(source)
const tree = parser(tokens)

console.log(tree)
