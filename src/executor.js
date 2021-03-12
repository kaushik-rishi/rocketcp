const shell = require('shelljs')
const Joi = require('joi')
const fs = require('fs')
const root = process.cwd()
const Red = '\x1b[31m'
const NC = '\x1b[0m'
const Blue = '\x1b[34m'
const Yellow = '\x1b[33m'
const Green = '\x1b[32m'
let config = null
try {
  config = require(`${root}/.config.json`)
} catch (e) {
  if (fs.existsSync(`${root}/.config.json`)) {
    console.log(`${Red}RCP reserved file .config.json is corupted.${NC}`)
  } else {
    console.log(`${Red}This is not a valid RCP problem directory.${NC}`)
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
      `${Red}This language is not added to this problem\n\n${Blue}Run : rcp --add=${Yellow}<Your Lang>\n${NC}To add a specific language to this problem.`
    )
  }
  const exeComands = config.langs[lang]
  let res = {}
  if (exeComands.requireCompilation) {
    console.log(`${Blue}Compiling...${NC}`)
    res = shell.exec(exeComands.compile)
    if (res.code !== 0) {
      console.log(`${Red}Compilation Failed.${NC}`)
      return
    }
  }
  console.log(`${Green}Compiled Successfully.\n\n${Blue}Executing...`)
  config.testCases.forEach((t, i) => {
    i += 1
    console.log(`${NC}Test Case ${i}: \n${NC}`)
    res = shell.exec(`${exeComands.run} < ${t.input}`, { silent: true })
    if (res.code !== 0) {
      console.log(`${Red}Run time error !!!\n\n${NC}${res.stderr}`)
      return
    }
    const out = fs.readFileSync(`${root}/${t.output}`).toString()
    if (match(out, res.stdout)) {
      console.log(`${Green}Passed Succesfully\n${NC}`)
    } else {
      console.log(
        `${Red}Failed\n${NC}\nExpected Output :\n${out}\nRecieved Output :\n${res.stdout}`
      )
    }
    delete res
  })
}
// execute('cpp');
