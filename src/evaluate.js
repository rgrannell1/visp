
const ast = require('./ast')
const parser = require('./parser')

const callCombiner = (call, dynenv) => {
  const args = call.arguments

  if (!call.fn || !call.fn.value) {
    throw new TypeError(`missing function symbol: ${parser.deparse(call)}`)
  }

  const calleable = dynenv[call.fn.value]
  if (calleable === undefined) {
    throw new Error(`symbol "${call.fn.value}" not defined`)
  }

  if (calleable.type === 'primitive') {

  } else if (calleable.type === 'applicative') {
    // eval args
  } else if (calleable.type === 'operative') {

  } else {
    throw new TypeError('cannot call.')
  }
}

const calleable = {}

calleable.primitive = underlying => {
  return {
    type: 'primitive',
    underlying
  }
}

calleable.operative = (formals, envformal, body, staticenv) => {
  // -- check that rest parameter is last.
  return {
    formals,
    envformal,
    body,
    staticenv,
    type: 'operative'
  }
}
calleable.applicative = () => {
  return {
    underlying,
    type: 'applicative'
  }
}

const coreEnv = {}

// -- todo eval arguments!
coreEnv['lookup-environment'] = calleable.primitive((symbol, env) => {
  if (symbol.type !== 'symbol') {
    throw new TypeError('cannot lookup non-symbol value')
  }

  if (!coreEnv.hasOwnProperty(symbol.value)) {
    throw new TypeError(`symbol "${symbol.value}" is not present in environment`)
  }

  return env[symbol.value]
})

coreEnv['$define!'] = calleable.primitive((dynenv, name, expr) => {
  const value = coreEnv.eval.underlying(expr, dynenv)

  if (name.type !== 'symbol') {
    throw new TypeError(`symbol must be a name, but a ${name.type} was supplied.`)
  }

  dynenv.set(name.name) = value
  return value
})

coreEnv.eval = calleable.primitive((expr, env) => {
  // -- switch to invoke

  if (expr && expr.hasOwnProperty('isFailure') && expr.isFailure !== true) {
    return coreEnv.eval.underlying(expr.data, env)
  } else if (expr.type === 'program') {
    for (const subExpr of expr.expressions) {
      coreEnv.eval.underlying(subExpr, env)
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

module.exports = function evaluateProgram (expr) {
  if (expr.isFailure !== false) {
    throw new SyntaxError('parse failed!')
  }

  const {data} = expr

  return coreEnv.eval.underlying(data, coreEnv)
}
