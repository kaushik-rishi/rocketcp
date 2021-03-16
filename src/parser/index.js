#!/usr/bin/env node

const ejs = require('ejs')
const fileUtils = require('../fileUtils')
const fs = require('fs')
const mkdirp = require('mkdirp')
const os = require('os')
const path = require('path')

const parserUtils = require('./utils')

const HOME = os.userInfo().homedir,
    ROOT = path.join(HOME, 'competitivecoding'),
    FILE_EXT_CPP = '.cpp',
    FILE_EXT_PY = '.py',
    defaultLang = 'noConfig'

// TODO for different Languages
templateContent = ''

async function parser(data) {
    let {
        name: problemName,
        group: folderName,
        url: problemUrl,
        tests: sampleTests,
        interactive: interactive,
        timeLimit: timeLimit,
        memoryLimit: memoryLimit
    } = data

    folderName = parserUtils.getFolderName(folderName)

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
    problemMetaData = parserUtils.commentifyMetaData(problemMetaData)

    let problemCode = parserUtils.getProblemCode(problemName)
    // make a source code file for the problem in cpp and copy the template
    fileUtils.write(
        problemDir,
        'Main' + FILE_EXT_CPP,
        problemMetaData + templateContent
    )
    fileUtils.write(
        problemDir,
        'Main' + FILE_EXT_PY,
        problemMetaData + templateContent
    )

    // save and get the test case files
    const testcases = parserUtils.saveSamples(
        problemDir,
        sampleTests,
        interactive
    )
    // creating content for makefile
    const makeFileContent = await new Promise((resolve, reject) => {
        ejs.renderFile(
            path.join(__dirname, '../templates/makefile.ejs'),
            {
                defaultLang,
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
}

module.exports = parser
