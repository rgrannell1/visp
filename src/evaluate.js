
const ast = require('./ast')

const callCombiner = (call, dynenv) => {
  const args = call.arguments
  const calleable = coreEnv['lookup-environment'](call.fn, dynenv)

  if (calleable.type === 'primitive') {
    // eval args
  } else if (calleable.type === 'applicative') {
    // eval args
  } else if (calleable.type === 'operative') {

  } else {
    throw new TypeError('cannot call.')
  }
}

const ctr = {}

ctr.primitive = underlying => {
  return {
    type: 'primitive',
    underlying
  }
}

ctr.operative = (formals, envformal, body, staticenv) => {
  // -- check that rest parameter is last.
  return {
    formals,
    envformal,
    body,
    staticenv,
    type: 'operative'
  }
}
ctr.applicative = () => {
  return {
    underlying,
    type: 'applicative'
  }
}

const coreEnv = {}

// -- todo eval arguments!
coreEnv['lookup-environment'] = ctr.primitive((symbol, env) => {
  if (symbol.type !== 'symbol') {
    throw new TypeError('cannot lookup non-symbol value')
  }

  if (!coreEnv.hasOwnProperty(symbol.value)) {
    throw new TypeError(`symbol "${symbol.value}" is not present in environment`)
  }

  return env[symbol.value]
})

coreEnv['$define!'] = ctr.primitive((dynenv, name, expr) => {
  const value = coreEnv.eval(expr, dynenv)

  if (name.type !== 'symbol') {
    throw new TypeError(`symbol must be a name, but a ${name.type} was supplied.`)
  }

  dynenv.set(name.name) = value
  return value
})

coreEnv.eval = ctr.primitive((expr, env) => {
  // -- switch to invoke

  if (expr && expr.hasOwnProperty('isFailure') && expr.isFailure !== true) {
    return coreEnv.eval(expr.data, env)
  } else if (expr.type === 'program') {
    for (const subExpr of expr.expressions) {
      coreEnv.eval(subExpr, env)
    }
  } else if (expr.type === 'call') {
    callCombiner(expr, env)
    // -- operatives and applicatives treat argument evaluation differently;
    // -- operatives control parameter evaluation, while applicatives always
    // -- evaluate their arguments

  } else {
    console.log(expr)
  }
})

module.exports = expr => {

    {
      type: 'call',
      fn: {
        type: 'symbol',
        value: 'eval'
      },
      arguments: args
    }

  return coreEnv.eval(expr, coreEnv)
}
