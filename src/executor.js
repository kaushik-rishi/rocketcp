/*
executor.js
- Based on a .config file present in the problem directory executes the program file based on the language given the test cases
*/

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
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
        let compilationResult = shell.exec(compileCommand)

        if (compilationResult.code !== 0)
            return console.log(chalk.red('Compilation Failed.'))

        console.log(chalk.green('Compiled Successfully.') + '\n\n')
    }

    console.log(chalk.blue('Running the code against test cases ..'))

    let testCaseFiles = fs.readdirSync(path.join(problemDir, 'testcases'))

    let inputFileRegex = new RegExp(/in([1-9])*\.txt/)
    let outputFileRegex = new RegExp(/out([1-9])*\.txt/)
    let inputFileIndices = []
    // let outputFileIndices = []

    testCaseFiles.forEach((fname) => {
        let match = fname.match(inputFileRegex)
        if (match) inputFileIndices.push(match[1])
    })

    // testCaseFiles.forEach(fname => {
    //     let match = fname.match(outputFileRegex)
    //     if (match && inputFileIndices.includes(match[1])) outputFileIndices.push(match[1])
    // })

    // config.testCases.forEach((t, i) => {
    //     i += 1
    //     console.log(`Test Case ${i}: \n`)

    //     res = shell.exec(`./${exeComands.run} < ${t.input}`, { silent: true })

    //     if (res.code !== 0) {
    //         return console.log(chalk.red('Run time error !!!\n\n') + res.stderr)
    //     }

    //     const out = fs.readFileSync(`${root}/${t.output}`).toString()

    //     if (match(out, res.stdout))
    //         console.log(chalk.green('Passed Succesfully\n'))
    //     else
    //         console.log(
    //             chalk.red('Failed') +
    //                 '\n\nExpected Output :\n' +
    //                 out +
    //                 '\nRecieved Output :\n' +
    //                 res.stdout
    //         )

    //     delete res
    // })
}

execute('cpp')
