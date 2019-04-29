
const ast = require('./ast')

const ctr = {}

ctr.primitive = underlying => ({underlying})
ctr.operative = (formals, envformal, body, staticenv) => {
  // -- check that rest parameter is last.
  return {
    formals,
    envformal,
    body,
    staticenv,
    invoke (exp, dynenv) {
      // -- ??
    }
  }
}

const coreEnv = new Map()

// -- todo eval arguments!
coreEnv.set('is?', function is (symbol, val) {
  if (!symbol || !symbol.type) {
    throw new TypeError('internal error: no type on supplied value.')
  }

  return ast.boolean(symbol.type === val.value)
})

coreEnv.set('is-symbol?', function isSymbol (symbol) {
  return coreEnv.get('is?')(symbol, ast.symbol('symbol'))
})

coreEnv.set('plus', function plus (symbol) {

})

coreEnv.set('lookup-environment', function lookupEnvironment (symbol, env) {
  if (symbol.type !== 'symbol') {
    throw new TypeError('cannot lookup non-symbol value')
  }

  if (!coreEnv.hasOwnProperty(symbol.value)) {
    throw new TypeError(`symbol "${symbol.value}" is not present in environment`)
  }

  return env[symbol.value]
})

coreEnv.set('$define!', function define (symbol, val) {
  if (symbol.type !== 'symbol') {
    throw new TypeError('cannot define non-symbol value')
  }

})

coreEnv.set('eval', (expr, env) => {
  const eval = coreEnv.get('eval')

  if (expr && expr.hasOwnProperty('isFailure') && expr.isFailure !== true) {
    return eval(expr.data, env)
  } else if (expr.type === 'program') {
    for (const subExpr of expr.expressions) {
      eval(subExpr, env)
    }
  } else if (expr.type === 'call') {
    const args = expr.arguments

    const calleable = coreEnv.get('lookup-environment')(expr.fn, env)

    // -- operatives and applicatives treat argument evaluation differently;
    // -- operatives control parameter evaluation, while applicatives always
    // -- evaluate their arguments

  } else {
    console.log(expr)
  }
})

coreEnv['make-base-env'] = () => {
  return Object.create(coreEnv, {})
}

coreEnv['$define!'] = ctr.primitive((dynenv, name, expr) => {
  const value = coreEnv.eval(expr, dynenv)

  if (name.type !== 'symbol') {
    throw new TypeError(`symbol must be a name, but a ${name.type} was supplied.`)
  }

  dynenv.set(name.name) = value
  return value
})

module.exports = expr => {
  return coreEnv.get('eval')(expr, coreEnv)
}
