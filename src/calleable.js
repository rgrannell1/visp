
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

calleable.applicative = underlying => {
  return {
    underlying,
    type: 'applicative'
  }
}

module.exports = calleable
