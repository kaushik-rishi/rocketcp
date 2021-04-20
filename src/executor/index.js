const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const sh = require('shelljs');
const cluster = require('cluster');
const chokidar = require('chokidar');

const commands = require('../commands.json');
const {
    getDiffString,
    getDifference,
    rtrimFullString
} = require('./diffChecker');

if (global.args.dir) {
    try {
        process.chdir(path.resolve(global.args.dir));
    } catch (e) {
        console.log(e);
        throw new Error(
            chalk.red(
                'Unable to mount on the provided directory!!!\n\nTerminating...'
            )
        );
    }
}

const problemDir = process.cwd();
const Lang = global.config.languages[global.config.defaultLanguage];

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

if (cluster.isMaster && global.args.watch) {
    console.log(
        chalk.gray(
            '[Watcher] Watching file : ' +
                path.join(problemDir, Lang.fileName + '\n')
        )
    );
    cluster.fork();
    let wait = false;
    chokidar.watch(path.join(problemDir, Lang.fileName)).on('change', () => {
        if (wait) return;
        wait = setTimeout(() => {
            wait = false;
        }, 500);
        console.log(
            chalk.keyword('gray')('\n[Watcher] Restarting due to changes...\n')
        );
        for (const id in cluster.workers) {
            console.log(id);
            cluster.workers[id].destroy();
        }
        cluster.fork();
    });
} else {
    console.log(
        chalk.keyword('gray')(
            '[Watcher] Starting test for ' +
                global.config.defaultLanguage +
                '\n'
        )
    );
    execute(global.config.defaultLanguage);
    console.log(
        chalk.keyword('gray')(
            '\n[Watcher] Test complete.\n[Watcher] Waiting for changes to restart...'
        )
    );
    // eslint-disable-next-line no-process-exit
    process.exit(0);
}

module.exports = execute;
