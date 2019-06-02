
const ast = require('./ast')
const parser = require('./parser')
const {Parser} = require('./pc')
const calleable = require('./calleable')

const lib = {
  hash: require('./lib/hash'),
  set: require('./lib/set'),
  list: require('./lib/list'),
  lens: require('./lib/lens'),
  symbol: require('./lib/symbol'),
  math: require('./lib/math'),
  functionals: require('./lib/functionals'),
  functionals: require('./lib/imports'),
}

const evalArgs = (args, dynenv) => {
  return args.map(arg => coreEnv.eval.underlying(arg, dynenv))
}

const internal = {
  assert: {}
}

internal.assert.isList = (val, paramName) => {
  if (val.type !== 'call' || val.fn.value !== 'list') {
    throw new Error(`${paramName} must be a list`)
  }
}

const callCombiner = (call, dynenv) => {
  const args = call.arguments

  if (!call.fn || !call.fn.value) {
    throw new TypeError(`missing function symbol: ${parser.deparse(call)}`)
  }

  if (!dynenv.hasOwnProperty(call.fn.value)) {
    throw new Error(`symbol "${call.fn.value}" not in scope`)
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

coreEnv['$pipe'] = calleable.primitive((receiver, ...args) => {
  const callsOrIds = args.slice(0, -1)
  const dynenv = args[args.length - 1]

  let tmp = coreEnv.eval.underlying(receiver, dynenv)

  for (const arg of callsOrIds) {
    if (arg.type === 'call') {
      const innerArgs = (arg.arguments || []).map(subArg => {
        return coreEnv.eval.underlying(subArg, dynenv)
      })

      tmp = tmp[arg.fn.value](...innerArgs)
    } else if (arg.type === 'symbol') {
      tmp = tmp[arg.value]
    }
  }

  return tmp
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

coreEnv['<-'] = coreEnv['$define!']

coreEnv['$match'] = calleable.primitive((val, pairs, dynenv) => {
  internal.assert.isList(pairs, 'pairs')

  for (const pair of pairs.arguments) {
    internal.assert.isList(pair, 'pair')

    const [predicate, expr] = pair.arguments
    const evalPredicate = coreEnv.eval.underlying(predicate, dynenv)

    const result = callCombiner({
      type: 'call',
      fn: predicate,
      arguments: [val]
    }, dynenv)

    if (result) {
      return coreEnv.eval.underlying(expr, dynenv)
    }
  }
});

coreEnv['$cond'] = calleable.primitive((val, pairs, dynenv) => {
  internal.assert.isList(pairs, 'pairs')

  for (const pair of pairs.arguments) {
    internal.assert.isList(pair, 'pair')

    const [bool, expr] = pair.arguments
    const evalBool = coreEnv.eval.underlying(predicate, dynenv)

    if (evalBool === true) {
      return coreEnv.eval.underlying(expr, dynenv)
    }
  }
});

coreEnv['$if'] = calleable.primitive((cond, first, second, dynenv) => {
  return coreEnv.eval.underlying(cond, dynenv) === true
    ? coreEnv.eval.underlying(first, dynenv)
    : coreEnv.eval.underlying(second, dynenv)
});

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
  } else if (expr.type === 'boolean') {
    return expr.value
  } else if (expr.type === 'keyword') {
    // -- todo set up global symbol registry
    return expr.value
  }  else if (expr.type === 'comment') {
    return
  } else {
    throw new TypeError(`unsupported sexpr ${JSON.stringify(expr, null, 2)}`)
  }
})

coreEnv['$lambda'] = calleable.primitive((formals, ...rest) => {
  const body = rest.slice(0, -1)
  const dynenv = rest[rest.length - 1]

  const scope = Object.assign({}, dynenv)

  return {
    underlying: (...args) => {
      if (formals.type === 'call') {
        if (formals.fn.value !== 'list') {
          throw new SyntaxError('invalid formals')
        }
        let ith = 0

        for (const formal of formals.arguments || []) {
          if (formal.type === 'symbol') {
            scope[formal.value] = args[ith]
          } else {
            throw new SyntaxError('invalid formal')
          }
          ith++
        }

      } else if (formals.type === 'symbol') {
        scope[formals.value] = args[0]
      } else {
        throw new SyntaxError('invalid formals')
      }

      let result;

      for (const expr of body) {
        result = coreEnv.eval.underlying(expr, scope)
      }

      return result
    },
    type: 'applicative'
  }
})

coreEnv['$fn'] = coreEnv['$lambda']

module.exports = function evaluateProgram (expr) {
  if (expr.isFailure !== false) {
    return Parser.report(expr)
  }

  return coreEnv.eval.underlying(expr.data, coreEnv)
}
