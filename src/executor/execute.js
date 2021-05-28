const fs = require('fs');
const sh = require('shelljs');
const chalk = require('chalk');
const path = require('path');
const child_process = require('child_process');
const cluster = require('cluster');

const {
    getDiffString,
    getDifference,
    rtrimFullString
} = require('./diffChecker');

let compileProcess = null;
let runProcess = null;

const compile = (compileCommand) => {
    console.log(chalk.blue('Compiling...'));
    compileProcess = sh.exec(compileCommand);
    const compilationResult = compileProcess;
    compileProcess = null;

    if (compilationResult.code !== 0) {
        console.log(chalk.red('Compilation Failed.'));
        return false;
    }

    console.log(chalk.green('Compiled Successfully.') + '\n');
    return true;
};

const getTestIndices = (problemDir) => {
    const testCaseFiles = fs.readdirSync(path.join(problemDir, 'testcases'));
    const inputFileRegex = new RegExp(/in([1-9])*\.txt/);
    const inputFileIndices = [];

    testCaseFiles.forEach((fname) => {
        const match = fname.match(inputFileRegex);
        if (match) inputFileIndices.push(match[1]);
    });
    return inputFileIndices;
};

const evaulateTestCase = (fileIndex, inputContent, out, opFilePath) => {
    const expectedOut = fs.readFileSync(opFilePath).toString();

    const difference = getDifference(out, expectedOut);
    if (difference === null) {
        console.log(chalk.green.underline(`\nPassed Test #${fileIndex}\n`));
        return;
    }

    console.log(chalk.red.underline(`Failed Test ${fileIndex}`));
    console.log(chalk.magentaBright.underline('\nInput'));
    console.log(inputContent);
    console.log(chalk.magentaBright.underline('\nExpected Output'));
    console.log(rtrimFullString(expectedOut));
    console.log(chalk.magentaBright.underline('\nRecieved Output'));
    console.log(rtrimFullString(out));

    if (!global.args.show_diff) return;

    console.log(chalk.yellow.underline('\nDifference'));
    console.log(getDiffString(difference));
};

const runTestCase = (runCommand, fileIndex) => {
    const inpFilePath = path.join('testcases', `in${fileIndex}.txt`);
    const opFilePath = path.join('testcases', `out${fileIndex}.txt`);
    const inputContent = rtrimFullString(
        fs.readFileSync(inpFilePath).toString()
    );
    runProcess = sh.exec(runCommand + '<' + inpFilePath, {
        silent: true
    });
    const result = runProcess;
    runProcess = null;

    const out = result.stdout;

    if (result.code !== 0) {
        console.log(chalk.red.underline(`Runtime error on test #${fileIndex}`));
        console.log(chalk.red('Error Message') + ' : ' + result.stderr + '\n');
        return;
    }

    if (fs.existsSync(opFilePath)) {
        return evaulateTestCase(fileIndex, inputContent, out, opFilePath);
    }

    console.log(chalk.underline(`Test ${fileIndex}`));
    console.log(chalk.yellow('No output file found [Custom test case]'));
    console.log(chalk.magentaBright.underline('\nInput'));
    console.log(inputContent);

    console.log(chalk.magentaBright.underline('\nOutput'));
    console.log(rtrimFullString(out));
};

const interactiveRun = (runCommand) => {
    return new Promise((resolve) => {
        runProcess = child_process.exec(runCommand);
        runProcess.stdout.pipe(process.stdout);
        process.stdin.pipe(runProcess.stdin);
        runProcess.on('exit', () => {
            process.stdin.unpipe(runProcess.stdin);
            runProcess = null;
            resolve();
        });
    });
    // await new Promise((resolve) => setTimeout(resolve, 100000));
};

// executes the program file feeding it in the test case files and matching the output against the output files
function execute(lang, problemDir) {
    const commandsData = global.config.languages[lang];
    const compileCommand = commandsData['compile'];
    const platform = process.platform === 'win32' ? 'win32' : 'unix';
    const runCommand = commandsData['run'][platform];

    if (!commandsData.isinterpreted) {
        if (!compile(compileCommand)) return;
    }

    if (global.args.interactive) return interactiveRun(runCommand);

    console.log(
        chalk.keyword('orange')('Running the code against test cases ...')
    );
    getTestIndices(problemDir).forEach((fileIndex) =>
        runTestCase(runCommand, fileIndex)
    );
}
if (cluster.isWorker) {
    process.on('message', function (m) {
        if (m == 'exit') {
            if (compileProcess) compileProcess.kill();
            if (runProcess) runProcess.kill();
            // eslint-disable-next-line no-process-exit
            process.exit(0);
        }
    });
}
module.exports = execute;
