const os = require('os');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const { validateConfig } = require('./validator');

const ROOT = path.join(os.userInfo().homedir, 'competitivecoding');

process.env.configAddress = path.join(ROOT, 'config.json');
process.env.srcAddress = path.join(__dirname, '../');

if (!fs.existsSync(ROOT)) {
    fs.mkdirSync(ROOT);
}
if (fs.existsSync(process.env.configAddress)) {
    try {
        global.config = validateConfig(require(process.env.configAddress));
    } catch (e) {
        console.log(e);
        console.log(chalk.red('Config file corupted'));
    }
}
if (!global.config) {
    console.log(
        'Using default config\n' +
            chalk.blue('Use "rktcp init" to update config\n')
    );
    try {
        global.config = validateConfig(require('./defaultconfig'));
    } catch (e) {
        console.log(e);
        throw new Error(
            chalk.red('Default config file corupted\n\nTerminating...')
        );
    }
}
