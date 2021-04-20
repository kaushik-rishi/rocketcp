const fs = require('fs');
const sh = require('shelljs');
const chalk = require('chalk');
const path = require('path');

const commands = require('../commands.json');
const {
    getDiffString,
    getDifference,
    rtrimFullString
} = require('./diffChecker');

const problemDir = process.cwd();

// executes the program file feeding it in the test case files and matching the output against the output files
function execute(lang) {
    if (!commands[lang]) {
        console.log(
            `${chalk.red('This language is not added to this problem')}
 ${chalk.blue('Run : rktcp --add=')}${chalk.yellow('<Your Lang>')}
 To add a specific language to this problem.`
        );
    }

    const commandsData = commands[lang];
    const compileCommand = commandsData['compile'];
    const runCommand =
        commandsData['run'][process.platform === 'win32' ? 'win32' : 'unix'];

    if (!runCommand.isinterpreted) {
        console.log(chalk.blue('Compiling...'));
        const compilationResult = sh.exec(compileCommand);

        if (compilationResult.code !== 0)
            return console.log(chalk.red('Compilation Failed.'));

        console.log(chalk.green('Compiled Successfully.') + '\n');
    }

    const testCaseFiles = fs.readdirSync(path.join(problemDir, 'testcases'));
    const inputFileRegex = new RegExp(/in([1-9])*\.txt/);
    const inputFileIndices = [];

    testCaseFiles.forEach((fname) => {
        const match = fname.match(inputFileRegex);
        if (match) inputFileIndices.push(match[1]);
    });

    console.log(
        chalk.keyword('orange')('Running the code against test cases ..\n')
    );

    inputFileIndices.forEach((fileIndex) => {
        const inpFilePath = path.join('testcases', `in${fileIndex}.txt`);
        const opFilePath = path.join('testcases', `out${fileIndex}.txt`);
        const inputContent = rtrimFullString(
            fs.readFileSync(inpFilePath).toString()
        );

        const result = sh.exec(runCommand + '<' + inpFilePath, {
            silent: true
        });
        const out = result.stdout;

        if (result.code !== 0) {
            console.log(
                chalk.red.underline(`Runtime error on test #${fileIndex}`)
            );
            console.log(
                chalk.red('Error Message') + ' : ' + result.stderr + '\n'
            );
        } else {
            if (fs.existsSync(opFilePath)) {
                const expectedOut = fs.readFileSync(opFilePath).toString();

                const difference = getDifference(out, expectedOut);
                if (difference === null)
                    console.log(
                        chalk.green.underline(`\nPassed Test #${fileIndex}\n`)
                    );
                else {
                    console.log(
                        chalk.red.underline(`Failed Test ${fileIndex}\n`) +
                            chalk.magentaBright.underline('\nInput\n') +
                            inputContent +
                            chalk.magentaBright.underline(
                                '\n\nExpected Output\n'
                            ) +
                            rtrimFullString(expectedOut) +
                            chalk.magentaBright.underline(
                                '\n\nRecieved Output\n'
                            ) +
                            rtrimFullString(out)
                    );
                    console.log(chalk.yellow.underline('\nDifference'));
                    console.log(getDiffString(difference));
                }
            } else {
                console.log(chalk.underline(`Test ${fileIndex}`));
                console.log(
                    chalk.yellow('No output file found [Custom test case]')
                );
                console.log(chalk.magentaBright.underline('\nInput'));
                console.log(inputContent);

                console.log(chalk.magentaBright.underline('\nOutput'));
                console.log(rtrimFullString(out));
            }
        }
    });
}

module.exports = execute;
