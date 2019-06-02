
const utils = {}

const ast = {}

ast.symbol = value => {
  return {type: 'symbol', value}
}

ast.number = value => {
  return {type: 'number', value}
}

ast.boolean = value => {
  return {type: 'boolean', value}
}

ast.keyword = value => {
  return {type: 'keyword', value}
}

ast.string = value => {
  return {type: 'string', value}
}

ast.call = (name, arguments) => {
  return {
    type: 'call',
    fn: {type: 'symbol', value: name},
    arguments: arguments
  }
}

utils.ast = ast

module.exports = utils
