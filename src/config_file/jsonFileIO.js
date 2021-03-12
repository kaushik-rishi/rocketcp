/*
Reading and Writing to the config file in the home directory
- write config file
- remove config file
- update config file
*/ 

const fs = require('fs')

// TODO : error validation in each of the functions

function writeConfig(configPath, confData) {
	// Write the configuration file with the details
	fs.writeFileSync(configPath, JSON.stringify(confData))
}

// TODO : Implement this child function after implementing the updateConfigCall() in index.js
function updateConfig(configPath, newConfData) {
	const confData = fs.readFileSync(configPath)
	console.log(Object.keys(newConfData))
}

function getData(configPath) {
	const confData = fs.readFileSync(configPath).toString()
	return confData
}

module.exports = {
	writeConfig,
	getData
}