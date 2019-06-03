
const path = require('path')
const Mustache = require('mustache')
const fs = require('fs').promises

const constants = {
  paths: {
    testsDocs: path.join(__dirname, '../../documentation/tests.md'),
    testsTemplate: path.join(__dirname, '../resources/tests.md')
  }
}

const command = {
  name: 'document',
  dependencies: []
}

command.cli = `
Usage:
  script document

Description:
  Document
`

command.task = async args => {
  const tests = require('../../tests/index')

  const view = {}
  view.modules = Object.values(tests).map(moduleData => {
    const moduleTests = Object.values(moduleData).map(testData => {
      return { documentation: testData.docs }
    })

    return {
      tests: moduleTests
    }
  })

  const content = (await fs.readFile(constants.paths.testsTemplate)).toString()
  const rendered = Mustache.render(content, view)

  await fs.writeFile(constants.paths.testsDocs, rendered)
}

module.exports = command
