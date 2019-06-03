
const path = require('path')
const Mustache = require('mustache')
const fs = require('fs').promises

const constants = {
  paths: {
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
  view.tests = Object.values(tests).map(moduleData => {
    return Object.values(moduleData).map(testData => {
      return { documentation: testData.docs }
    })
  })

  const xx = (await fs.readFile(constants.paths.testsTemplate)).toString()
  const rendered = Mustache.render(xx, view)

  console.log(rendered)
}

module.exports = command
