#!/usr/bin/env node

const http = require('http')
const os = require('os')
const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')
const ejs = require('ejs')

const fileUtils = require('./fileUtils')

const HOME = os.userInfo().homedir,
  ROOT = path.join(HOME, 'competitivecoding'),
  TEMPLATES = path.join(HOME, '.cptemplates'),
  FILE_EXT = '.cpp',
  TEMPLATE_PATH = path.join(TEMPLATES, 'main') + FILE_EXT

templateContent = fs.existsSync(TEMPLATE_PATH)
  ? fs.readFileSync(TEMPLATE_PATH).toString()
  : ''

function commentifyMetaData(problemMetaData) {
  // problemMetaData =
  //     `Name of problem: ${problemName}\nContest: ${folderName}\nLink to problem: ${problemUrl}\nTime Limit: ${timeLimit / 1000} second(s)\nMemory Limit: ${memoryLimit} mb`;

  // adding comments to the metadata [BUG: added incrementally]
  // TODO : add comments based on language
  problemMetaData = '/*\n' + problemMetaData + '\n*/\n'
  return problemMetaData
}

function saveSamples(problemDir, sampleTests, isInteractive) {
  let interactive = isInteractive ? 'interactive-' : ''
  const testCases = []
  sampleTests.forEach((test, index) => {
    fileUtils.createWrite(
      problemDir,
      `${interactive}in${index + 1}.txt`,
      test.input
    )
    fileUtils.createWrite(
      problemDir,
      `${interactive}out${index + 1}.txt`,
      test.output
    )
    testCases.push({
      input: `${interactive}in${index + 1}.txt`,
      output: `${interactive}out${index + 1}.txt`
    })
  })
  return testCases
}

function getProblemCode(problemName) {
  // TODO : return the problem code based on different cp platforms
  return problemName.split(' ')[0][0].trim()
}

function getFolderName(folderName) {
  // TODO : make folder based on different cp platforms
  return folderName.split('-').pop().trim()
}

const server = http.createServer((req, res) => {
  let bodyBuffer = ''
  req.on('data', (chunk) => (bodyBuffer += chunk))

  req.on('end', async () => {
    const data = JSON.parse(bodyBuffer.toString())
    let {
      name: problemName,
      group: folderName,
      url: problemUrl,
      tests: sampleTests,
      interactive: interactive,
      timeLimit: timeLimit,
      memoryLimit: memoryLimit
    } = data

    folderName = getFolderName(folderName)

    let contestDir = path.join(ROOT, folderName)
    let problemDir = path.join(contestDir, problemName)

    // returns the path from onward which the directories are made
    mkdirp.sync(problemDir)
    console.log(
      `Created a directory for the problem ${problemName} => ${problemDir}`
    )

    problemMetaData = `Name of problem: ${problemName}\nContest: ${folderName}\nLink to problem: ${problemUrl}\nTime Limit: ${
      timeLimit / 1000
    } second(s)\nMemory Limit: ${memoryLimit} mb`
    problemMetaData = commentifyMetaData(problemMetaData)

    let problemCode = getProblemCode(problemName)
    // make a source code file for the problem in cpp and copy the template
    fileUtils.write(
      problemDir,
      problemCode + FILE_EXT,
      problemMetaData + templateContent
    )

    // save and get the test case files
    const testcases = saveSamples(problemDir, sampleTests, interactive)
    // creating content for makefile
    const makeFileContent = await new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(__dirname, '/templates/makefile.ejs'),
        {
          program: problemCode + FILE_EXT,
          testcases
        },
        (err, content) => {
          if (err) reject(err)
          resolve(content)
        }
      )
    })
    // saving make file
    fileUtils.write(problemDir, 'Makefile', makeFileContent)
  })
})

const PORT_POST = 10045
server.listen(PORT_POST, () =>
  console.log(`Listening for Parsed problem POST requests on Port ${PORT_POST}`)
)
