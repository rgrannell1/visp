
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

coreEnv.eval = (type, env) => {
  console.log(type)
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
