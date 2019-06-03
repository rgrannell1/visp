
const command = {
  name: 'test',
  dependencies: []
}

command.cli = `
Usage:
  script test [--watch]

Description:
  Run tests for each submodule
`

command.task = async args => {
  require('../../tests/run')
}

module.exports = command