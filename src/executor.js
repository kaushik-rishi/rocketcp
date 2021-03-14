/*
executor.js
- Based on a .config file present in the problem directory executes the program file based on the language given the test cases
*/

const chalk = require('chalk')
const fs = require('fs')
const shell = require('shelljs')

const root = process.cwd()

let config = null

try {
    // try to get the config file in the problem directory
    // TODO : Validate the .config file and throw error

    config = require(`${root}/.config.json`)
} catch (err) {
    // if there was problem getting the config file

    // if the config file existed
    if (fs.existsSync(`${root}/.config.json`)) {
        console.log(chalk.red('RCP reserved file .config.json is corupted.'))
    } else {
        // if no such file exists
        console.log(chalk.red('This is not a valid RCP problem directory.'))
    }

    process.exit(1)
}

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
    if (!config.langs[lang]) {
        console.log(
            `${chalk.red('This language is not added to this problem')}
 ${chalk.blue('Run : rcp --add=')}${chalk.yellow('<Your Lang>')}
 To add a specific language to this problem.`
        )
    }

    const exeComands = config.langs[lang]
    let res = {}

    if (exeComands.requireCompilation) {
        console.log(chalk.blue('Compiling...'))
        res = shell.exec(exeComands.compile)

        if (res.code !== 0) {
            console.log(chalk.red('Compilation Failed.'))
            return
        }
    }

    console.log(
        chalk.green('Compiled Successfully.') +
            '\n\n' +
            chalk.blue('Executing...')
    )

    config.testCases.forEach((t, i) => {
        i += 1
        console.log(`Test Case ${i}: \n`)

        res = shell.exec(`./${exeComands.run} < ${t.input}`, { silent: true })

        if (res.code !== 0) {
            return console.log(chalk.red('Run time error !!!\n\n') + res.stderr)
        }

        const out = fs.readFileSync(`${root}/${t.output}`).toString()

        if (match(out, res.stdout))
            console.log(chalk.green('Passed Succesfully\n'))
        else
            console.log(
                chalk.red('Failed') +
                    '\n\nExpected Output :\n' +
                    out +
                    '\nRecieved Output :\n' +
                    res.stdout
            )

        delete res
    })
}

execute('cpp')
