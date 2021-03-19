const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const sh = require('shelljs')
const commands = require('./commands.json')

const problemDir = process.cwd()

// trims the block of spaces at the end of a string
function rtrim(str) {
    if (str == null) return str
    return str.replace(/\s+$/g, '')
}

// returns wether the solution matches the test or not
function match(sol, test) {
    // TODO : use better diff algorithm or diff package to show the difference
    if (!sol) return false

    sol = sol.split('\n')
    test = test.split('\n')

    if (sol.length < test.length) return false

    for (let i = 0; i < test.length; i += 1)
        if (rtrim(sol[i]) != rtrim(test[i])) return false

    return true
}

// executes the program file feeding it in the test case files and matching the output against the output files
function execute(lang) {
    if (!commands[lang]) {
        console.log(
            `${chalk.red('This language is not added to this problem')}
 ${chalk.blue('Run : rcp --add=')}${chalk.yellow('<Your Lang>')}
 To add a specific language to this problem.`
        )
    }

    let commandsData = commands[lang]
    let compileCommand = commandsData['compile']
    let runCommand =
        commandsData['run'][process.platform === 'win32' ? 'win32' : 'unix']

    if (!runCommand.isinterpreted) {
        console.log(chalk.blue('Compiling...'))
        let compilationResult = sh.exec(compileCommand)

        if (compilationResult.code !== 0)
            return console.log(chalk.red('Compilation Failed.'))

        console.log(chalk.green('Compiled Successfully.') + '\n')
    }

    let testCaseFiles = fs.readdirSync(path.join(problemDir, 'testcases'))
    let inputFileRegex = new RegExp(/in([1-9])*\.txt/)
    let inputFileIndices = []

    testCaseFiles.forEach((fname) => {
        let match = fname.match(inputFileRegex)
        if (match) inputFileIndices.push(match[1])
    })

    console.log(chalk.cyan('Running the code against test cases ..\n'))

    inputFileIndices.forEach((fileIndex) => {
        let inpFileName = `in${fileIndex}.txt`
        let opFileName = `out${fileIndex}.txt`
        let result = sh.exec(
            runCommand + '<' + path.join('testcases', inpFileName),
            { silent: true }
        )
        let out = result.stdout

        if (result.code !== 0) {
            console.log(
                chalk.red.underline(`Runtime error on test #${fileIndex}`)
            )
            console.log(
                chalk.red('Error Message') + ' : ' + result.stderr + '\n'
            )
        } else {
            if (fs.existsSync(path.join('testcases', opFileName))) {
                let expectedOut = fs
                    .readFileSync(path.join('testcases', opFileName))
                    .toString()

                if (match(expectedOut, out))
                    console.log(chalk.green(`Passed Test #${fileIndex}`))
                else
                    console.log(
                        chalk.red(`Failed Test ${fileIndex}`) +
                            chalk.magentaBright('\nExpected Output :\n') +
                            expectedOut +
                            chalk.magentaBright('\nRecieved Output :\n') +
                            out
                    )
            } else {
                console.log('\n' + chalk.underline(`Test ${fileIndex}`))
                console.log(chalk.yellow('No output file found'))
                console.log(chalk.blue('-------- INPUT --------'))
                console.log(
                    fs
                        .readFileSync(path.join('testcases', inpFileName))
                        .toString()
                )

                console.log(chalk.blue('-------- OUTPUT --------'))
                console.log(out)
            }
        }
    })
}
module.exports = execute
// execute('cpp')
