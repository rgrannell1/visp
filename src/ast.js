
const ast = {}

ast.number = data => {
  return {
    type: 'number',
    value: parseFloat(data)
  }
}

ast.boolean = data => {
  return {
    type: 'boolean',
    value:data === '#t'
  }
}

ast.inert = data => {
  return {
    type: 'inert',
    value: '#inert'
  }
}

ast.string = data => {
  return {
    type: 'string',
    value:data.slice(1, -1)
  }
}

ast.symbol = data => {
  return {
    type: 'symbol',
    value: data
  }
}

ast.keyword = data => {
  return {
    type: 'keyword',
    value:data
  }
}

ast.call = data => {
  const [fn, lhb, args, rhb] = data

  const final = {
    type: 'call',
    fn,
    arguments: args
  }

  return final
}

ast.list = data => {
  const [lhb, args, rhb] = data

  const final = {
    type: 'call',
    fn: {
      type: 'symbol',
      value: 'list'
    },
    arguments: args
  }

  return final
}

ast.program = data => {
  const [expressions] = data

  const final = {
    type: 'program',
    expressions: expressions[0]
  }

  return final
}

module.exports = ast
