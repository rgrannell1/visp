
const path = require('path')
const Mustache = require('mustache')
const fs = require('fs').promises

const constants = {
  paths: {
    testsDocs: path.join(__dirname, '../../documentation/tests.md'),
    testsTemplate: path.join(__dirname, '../resources/tests.md'),
    parserDocs: path.join(__dirname, '../../documentation/parser.md'),
    parserTemplate: path.join(__dirname, '../resources/parser.md')
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

const write = {}

write.tests = async () => {
  const tests = require('../../tests/index')

  const view = {}
  view.modules = Object.values(tests).map(moduleData => {
    const moduleTests = Object.values(moduleData).map(testData => {
      return {
        documentation: testData.docs,
        source: testData.run.toString()
      }
    })

    return {
      tests: moduleTests
    }
  })

  await writeTemplate({
    source: constants.paths.testsTemplate,
    target: constants.paths.testsDocs
  }, view)
}

write.parser = async () => {
  const parser = require('../../src/parser')

  const view = {}
  view.merp = Object.values(parser).map(fnData => {
    return {
      documentation: fnData.docs,
      source: fnData.run.toString()
    }
  })

  await writeTemplate({
    source: constants.paths.parserTemplate,
    target: constants.paths.parserDocs
  }, view)
}

const writeTemplate = async ({source, target}, view) => {
  const content = (await fs.readFile(source)).toString()
  const rendered = Mustache.render(content, view)

  await fs.writeFile(target, rendered)
}

command.task = async args => {
  await write.tests()
  await write.parser()
}

module.exports = command
