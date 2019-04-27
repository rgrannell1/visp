
const coreEnv = {}

coreEnv['make-base-env'] = () => {
  return Object.create(coreEnv, {})
}

coreEnv.eval = type => {
  console.log(type)
}

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
