#!/usr/bin/env node
'use strict';

// Code for the CLI App
require('./serverUtils/loadconfig');
const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');

const parser = new ArgumentParser({
    description:
        'A command line client for parsing the test cases using the competitive companion extension and testing the users solution. 🎯'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('mode', {
    help: 'Allows the user to start RKTCP in different modes',
    type: String,
    choices: ['listen', 'init', 'test'],
    nargs: '?',
    default: 'listen'
});
parser.add_argument('-l', '--lang', {
    help: 'OverRides the default language.',
    choices: Object.keys(global.config.languages)
});
parser.add_argument('-d', '--dir', {
    help: 'OverRides the default directory of operations.'
});
parser.add_argument('-w', '--watch', {
    action: 'store_true',
    help: 'Used in test mode to run automatically when source code is updated'
});
parser.add_argument('-i', '--interactive', {
    action: 'store_true',
    help: 'Used in test mode to run the source code in a interactive way.'
});

const args = parser.parse_args();
global.args = args;

if (args.lang) {
    global.config.defaultLanguage = args.lang;
}
if (args.dir) {
    global.config.mountPoint = args.dir;
}

if (args.mode === 'listen') {
    require('./server');
}

if (args.mode === 'init') {
    require('./configuration/server');
}

if (args.mode === 'test') {
    require('./executor/index');
}
