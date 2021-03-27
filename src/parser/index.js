const fileUtils = require('../fileUtils');
const fs = require('fs');
const mkdirp = require('mkdirp');
const os = require('os');
const path = require('path');

const parserUtils = require('./utils');

// TODO : get the data from the configuration file
const HOME = os.userInfo().homedir,
    ROOT = path.join(HOME, 'competitivecoding'),
    FILE_EXT_CPP = '.cpp';

// TODO : for different Languages
let templateContent = fs
    .readFileSync(path.join(__dirname, '..', 'templates', 'codes', 'cpp.txt'))
    .toString();

function parser(data, spinner) {
    let {
        name: problemName,
        group: folderName,
        url: problemUrl,
        tests: sampleTests,
        interactive: interactive,
        timeLimit: timeLimit,
        memoryLimit: memoryLimit
    } = data;

    try {
        folderName = parserUtils.getFolderName(folderName);

        let contestDir = path.join(ROOT, folderName);
        let problemDir = path.join(contestDir, problemName);
        let problemTestsDir = path.join(problemDir, 'testcases');

        // returns the path from onward which the directories are made
        mkdirp.sync(problemTestsDir);

        // console.log(`Created a directory for the problem ${problemName} => ${problemDir}`)
        spinner.text = `Making files for ${problemName}`;

        let problemMetaData = `Name of problem: ${problemName}\nContest: ${folderName}\nLink to problem: ${problemUrl}\nTime Limit: ${
            timeLimit / 1000
        } second(s)\nMemory Limit: ${memoryLimit} mb`;
        problemMetaData = parserUtils.commentifyMetaData(problemMetaData);

        // make a source code file for the problem in cpp and copy the template

        // TODO : make files based on configuration file
        fileUtils.write(
            problemTestsDir,
            'Main' + FILE_EXT_CPP,
            problemMetaData + templateContent
        );

        // TODO : copy the template from the configuration file

        // save the test case files
        parserUtils.saveSamples(problemTestsDir, sampleTests, interactive);

        spinner.succeed(`Successfully created files for ${problemName}`);
    } catch (err) {
        spinner.fail(`${String(err)} for ${problemName}`);
    }
}

module.exports = parser;
