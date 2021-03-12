#!/usr/bin/env node

const dotenv = require('dotenv')
const ejs = require('ejs')
const fs = require('fs')
const http = require('http')
const mkdirp = require('mkdirp')
const path = require('path')

dotenv.config()

const fileUtils = require('./fileUtils')
const { getData: getConfiguationData } = require('./config_file/jsonFileIO')
const configurationData = getConfiguationData()

const
  ROOT = path.join(configurationData.cp_home, 'competitivecoding'),
  TEMPLATE_PATH = configurationData.template_path,
  FILE_EXT = configurationData.file_ext

templateContent = fs.existsSync(TEMPLATE_PATH)
  ? fs.readFileSync(TEMPLATE_PATH).toString()
  : ''

/**
* Add comments for the metadata based on the language
* @param  {String} problemMetaData The metadata of the problem
* @return {String}      Commented metadata
*/
function commentifyMetaData(problemMetaData) {
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

/**
* Generate problem code based on the CP Platform the question belongs to
* @param  {String} problemName The name of the problem
* @return {String}      problem code of the problem
*/
function getProblemCode(problemName) {
  // TODO : return the problem code based on different cp platforms
  return problemName.split(' ')[0][0].trim()
}

/**
* Generate folder name based on the CP Platform the question belongs to
* @param  {String} folderName the base folder name / group name
* @param  {String} platform the name of the cp platform
* @return {String}      folder name for the contest
*/
function getFolderName(folderName, platform) {
  // TODO : make folder based on different cp platforms
  return folderName.split('-').pop().trim()
}

const server = http.createServer(req => {
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

    let platform = folderName.split(' ').pop()

    folderName = getFolderName(folderName, platform)
    let contestDir = path.join(ROOT, folderName)
    let problemDir = path.join(contestDir, problemName)

    // returns the path from onward which the directories are made
    mkdirp.sync(problemDir)
    console.log(
      `Created a directory for the problem ${problemName} => ${problemDir}`
    )

    problemMetaData = `Name of problem: ${problemName}\nContest: ${folderName}\nLink to problem: ${problemUrl}\nTime Limit: ${timeLimit / 1000
      } second(s)\nMemory Limit: ${memoryLimit} mb`
    problemMetaData = commentifyMetaData(problemMetaData)

    let problemCode = getProblemCode(problemName, platform)
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
