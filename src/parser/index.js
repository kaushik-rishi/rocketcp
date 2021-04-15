const fileUtils = require('../fileUtils');
const mkdirp = require('mkdirp');
const path = require('path');

const parserUtils = require('./utils');

const ROOT = path.resolve(global.config.mountPoint);
const FILE_Name =
    global.config.languages[global.config.defaultLanguage].fileName;
const templateContent =
    global.config.languages[global.config.defaultLanguage].template;

function parser(data, spinner) {
    const {
        name: problemName,
        url: problemUrl,
        tests: sampleTests,
        interactive: interactive,
        timeLimit: timeLimit,
        memoryLimit: memoryLimit
    } = data;
    let { group: folderName } = data;
    try {
        folderName = parserUtils.getFolderName(folderName);

        const contestDir = path.join(ROOT, folderName);
        const problemDir = path.join(contestDir, problemName);
        const problemTestsDir = path.join(problemDir, 'testcases');

        mkdirp.sync(problemTestsDir);
        mkdirp.sync(path.dirname(path.join(problemDir, FILE_Name)));

        // console.log(`Created a directory for the problem ${problemName} => ${problemDir}`)
        spinner.text = `Making files for ${problemName}`;

        let problemMetaData = `Name of problem: ${problemName}\nContest: ${folderName}\nLink to problem: ${problemUrl}\nTime Limit: ${
            timeLimit / 1000
        } second(s)\nMemory Limit: ${memoryLimit} mb`;
        problemMetaData = parserUtils.commentifyMetaData(problemMetaData);

        fileUtils.write(
            problemDir,
            FILE_Name,
            problemMetaData + templateContent
        );

        parserUtils.saveSamples(problemTestsDir, sampleTests, interactive);

        spinner.succeed(`Successfully created files for ${problemName}`);
    } catch (err) {
        spinner.fail(`${String(err)} for ${problemName}`);
    }
}

module.exports = parser;
