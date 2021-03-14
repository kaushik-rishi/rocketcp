const chalk = require('chalk')
const fs = require('fs')
const Joi = require('joi')
const shell = require('shelljs')

const root = process.cwd()

let config = null

try {
    config = require(`${root}/.config.json`)
} catch (err) {
    if (fs.existsSync(`${root}/.config.json`)) {
        console.log(chalk.red('RCP reserved file .config.json is corupted.'))
    } else {
        console.log(chalk.red('This is not a valid RCP problem directory.'))
    }
    process.exit(1)
}

function rtrim(str) {
    if (str == null) return str
    return str.replace(/\s+$/g, '')
}

function match(sol, test) {
    if (!sol) return false
    sol = sol.split('\n')
    test = test.split('\n')

    if (sol.length < test.length) return false

    for (let i = 0; i < test.length; i += 1) {
        if (rtrim(sol[i]) != rtrim(test[i])) return false
    }

    return true
}

const execute = (lang) => {
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
        `${chalk.green('Compiled Successfully.')} \n\n${chalk.blue(
            'Executing...'
        )}`
    )

    config.testCases.forEach((t, i) => {
        i += 1
        console.log(`Test Case ${i}: \n`)

        res = shell.exec(`${exeComands.run} < ${t.input}`, { silent: true })

        if (res.code !== 0) {
            return console.log(chalk.red('Run time error !!!\n\n') + res.stderr)
        }

        const out = fs.readFileSync(`${root}/${t.output}`).toString()

        if (match(out, res.stdout))
            console.log(chalk.green('Passed Succesfully\n'))
        else
            console.log(
                `${chalk.red(
                    'Failed'
                )}\n\nExpected Output :\n${out}\nRecieved Output :\n${
                    res.stdout
                }`
            )

        delete res
    })
}
// execute('cpp');
