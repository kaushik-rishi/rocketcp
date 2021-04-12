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
