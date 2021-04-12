const os = require('os');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const ROOT = path.join(os.userInfo().homedir, 'competitivecoding');

process.env.configAddress = path.join(ROOT, 'config.json');

if (fs.existsSync(process.env.configAddress)) {
    try {
        global.config = require(process.env.configAddress);
    } catch (e) {
        console.log(e);
        console.log(chalk.red('Config file corupted'));
    }
}
if (!global.config) {
    console.log(
        'Using default config\n\n' +
            chalk.blue('Use "rktcp init" to update config')
    );
    global.config = require('./defaultconfig.json');
}
