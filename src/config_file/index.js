const chalk = require('chalk')
const fs = require('fs')
const os = require('os')
const path = require('path')
const prompt = require('prompt-sync')({ sigint: true })

const { writeConfig } = require('./jsonFileIO')

const configPath = path.join(os.userInfo().homedir, process.env.CONFIG_DOTFILE_NAME)

// TODO : Make the error validation in the initConfig method even better

function isConfigPresent() {
	// TODO : Using a function because going ahead we can may be add some feature like checking for the config file in different directories
	return fs.existsSync(configPath)
}

// TODO 1 : extract each of these languagePrompt and other prompts into a function
// TODO 2 : refactor the initConfig() based on the extracted functions
// TODO 3 : implement the updateConfigCall() method 

function initConfig() {
	const confData = {
		'language': '',
		'template_path': '',
		'cp_home': ''
	}
	const languages = ['C++ 17', 'C++ 14', 'Python 3/PyPy', 'Java']

	console.log(chalk.green('What language do you prefer for competitive coding ?') + chalk.yellow(' [You can change this later]'))
	console.log('0: C++ 17')
	console.log('1: C++ 14')
	console.log('2: Python 3 / PyPy')
	console.log('3: Java')

	const languageChoice = + prompt(chalk.blue('> ')).trim()
	if (!(languageChoice < languages.length && languageChoice >= 0)) {
		console.log(chalk.red('\nInvalid Input'))
		initConfig()
		return
	}

	confData.language = languages[languageChoice]
	console.log(chalk.yellow(`\nYou've selected the language ${languages[languageChoice]}\n`))

	confData.file_ext = getFileExtension(confData.language)

	console.log(chalk.green('Specify the path of your template file') + chalk.yellow(' [  code files will be generated based on this template file ]'))
	const templatePath = prompt(chalk.blue('> '))

	if (!fs.existsSync(templatePath)) {
		console.log(chalk.red('\nInvalid Input : no template file exists at that path'))
		initConfig()
		return
	}

	if (!fs.lstatSync(templatePath).isFile()) {
		console.log(chalk.red('\nInvalid Input : The path doesnot represent a file'))
		initConfig()
		return
	}
	confData.template_path = templatePath

	console.log(chalk.green('Specify the path of directory where the \'competitivecoding\' directory will be mounted'))
	const mountPoint = prompt(chalk.blue('> '))

	if (!fs.existsSync(mountPoint)) {
		console.log(chalk.red('\nInvalid Input : no such directory exists'))
		initConfig()
		return
	}

	if (!fs.lstatSync(mountPoint).isDirectory()) {
		console.log(chalk.red('\nInvalid Input : The path doesnot represent a directory'))
		initConfig()
		return
	}

	confData.cp_home = mountPoint
	writeConfig(configPath, confData)
}

if (!isConfigPresent()) {
	initConfig()
}

function getFileExtension(language) {
	switch (language) {
		case 'C++ 15':
		case 'C++ 17':
			return '.cpp'
		case 'Java':
			return '.java'
		case 'Python 3/PyPy':
			return '.py'
		default:
			return '.txt'
	}
}

module.exports = {
	initConfig
}