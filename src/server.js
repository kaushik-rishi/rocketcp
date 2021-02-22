#!/usr/bin/env node

const http = require('http');
const os = require('os');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');

const fileUtils = require('./fileUtils');

const HOME = (os.userInfo().homedir),
	  ROOT = path.join(HOME, 'competitivecoding'),
	  TEMPLATES = path.join(HOME, '.cptemplates'),
	  FILE_EXT = ".cpp",
	  TEMPLATE_PATH = path.join(TEMPLATES, 'main') + FILE_EXT;

templateContent = fs.existsSync(TEMPLATE_PATH) ? fs.readFileSync(TEMPLATE_PATH).toString() : '';

function saveSamples(problemDir, sampleTests) {
    sampleTests.forEach((test, index) => {
        fileUtils.createWrite(problemDir, `${interactive}in${index+1}.txt`, test.input);
        fileUtils.createWrite(problemDir, `${interactive}out${index+1}.txt`, test.output);
    });
}

function getProblemCode(problemName) {
    // TODO: make the problem codes based on different cp platforms
    return problemName.split(' ')[0][0].trim();
}

const server = http.createServer((req, res) => {
    let bodyBuffer = '';
    req.on('data', (chunk) => bodyBuffer += chunk)

    req.on('end', async () => {
        const data = JSON.parse(bodyBuffer.toString());
        let problemMetaData;

        let {
        	name: problemName,
        	group: folderName,
        	url: problemUrl,
        	tests: sampleTests,
        	interactive: interactive,
            timeLimit: timeLimit,
            memoryLimit: memoryLimit,
        } = data;

        interactive ? interactive = 'interactive-' : interactive = '';

        folderName = folderName.split('-').pop().trim();

        problemMetaData =
        `Name of problem: ${problemName}\nContest: ${folderName}\nLink to problem: ${problemUrl}\nTime Limit: ${timeLimit/1000} second(s)\nMemory Limit: ${memoryLimit} mb`;

        // adding comments to the metadata [BUG: added incrementally]
        // TODO: add comments based on language
        problemMetaData = '/*\n' + problemMetaData + '\n*/\n';

        let contestDir = path.join(ROOT, folderName);
        let problemDir = path.join(contestDir, problemName);

        // returns the path from onward which the directories are made
    	mkdirp.sync(problemDir);

    	let problemCode = getProblemCode(problemName);

        // make a source code file for the problem in cpp and copy the template
    	fileUtils.write(problemDir, problemCode + FILE_EXT, problemMetaData + templateContent);

        // save the test case files
        saveSamples(problemDir, sampleTests);
    });
});

const PORT_POST = 10045;
server.listen(PORT_POST, () => console.log(`Listening for Parsed problem POST requests on Port ${PORT_POST}`));