
const ast = require('./ast')
const parser = require('./parser')
const calleable = require('./calleable')

const lib = {
  hash: require('./lib/hash'),
  set: require('./lib/set'),
  list: require('./lib/list'),
  lens: require('./lib/lens'),
  symbol: require('./lib/symbol')
}

const evalArgs = (args, dynenv) => {
  return args.map(arg => coreEnv.eval.underlying(arg, dynenv))
}

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
    return calleable.underlying(...call.arguments, dynenv)
  } else if (calleable.type === 'applicative') {
    return calleable.underlying(...evalArgs(call.arguments, dynenv))
  } else if (calleable.type === 'operative') {
    throw new Error('operative not implemented')
  } else {
    throw new TypeError('cannot call.')
  }
}

const coreEnv = Object.assign({}, ...Object.values(lib))

coreEnv.show = calleable.primitive((expr, dynenv) => {
  console.log(coreEnv.eval.underlying(expr, dynenv))
})

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

// -- switch to operative
coreEnv['$define!'] = calleable.primitive((name, expr, dynenv) => {
  const value = coreEnv.eval.underlying(expr, dynenv)

  if (name.type !== 'symbol') {
    throw new TypeError(`symbol must be a name, but a ${name.type} was supplied.`)
  }

  dynenv[name.value] = value
  return value
})

// -- occasionally useful
coreEnv.plus = calleable.applicative((num0, num1) => num0 + num1)
coreEnv.minus = calleable.applicative((num0, num1) => num0 - num1)
coreEnv.times = calleable.applicative((num0, num1) => num0 * num1)
coreEnv.over = calleable.applicative((num0, num1) => num0 / num1)

coreEnv.eval = calleable.primitive((expr, env) => {
  // -- switch to invoke

  if (expr && expr.hasOwnProperty('isFailure') && expr.isFailure !== true) {
    return coreEnv.eval.underlying(expr.data, env)
  } else if (expr.type === 'program') {
    for (const subExpr of expr.expressions) {
      coreEnv.eval.underlying(subExpr, env)
    }
  } else if (expr.type === 'call') {
    return callCombiner(expr, env)
  } else if (expr.type === 'symbol') {
    const lookedUp = env[expr.value]
    if (lookedUp === undefined) {
      throw new Error(`${expr.value} is not defined in:\n ${Object.keys(env).join('\n')}`)
    }

    return lookedUp
  } else if (expr.type === 'number') {
    return expr.value
  } else if (expr.type === 'string') {
    return expr.value
  } else {
    throw new TypeError(`unsupported sexpr ${JSON.stringify(expr)}`)
  }
})

module.exports = function evaluateProgram (expr) {
  if (expr.isFailure !== false) {
    throw new SyntaxError('parse failed!')
  }

  return coreEnv.eval.underlying(expr.data, coreEnv)
}
