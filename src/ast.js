
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

ast.string = data => {
  return {
    type: 'string',
    value:data.slice(1, -1)
  }
}

ast.symbol = data => {
  return {
    type: 'symbol',
    value:data
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

module.exports = ast
