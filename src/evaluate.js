
const coreEnv = {}

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

coreEnv.eval = (expr, env) => {
  if (expr && expr.hasOwnProperty('isFailure') && expr.isFailure !== true) {
    return coreEnv.eval(expr.data, env)
  } else if (expr.type === 'program') {
    for (const subExpr of expr.expressions) {
      coreEnv.eval(subExpr, env)
    }
  } else if (expr.type === 'call') {
    const fn = expr.fn.value
    const args = expr.arguments

    // -- operatives and applicatives treat argument evaluation differently;
    // -- operatives control parameter evaluation, while applicatives always
    // -- evaluate their arguments

  } else {
    console.log(expr)
  }
}

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
  return coreEnv.eval(expr, coreEnv)
}
