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

let args = parser.parse_args();
if (args.mode === 'listen') {
    require('./server');
}

if (args.mode === 'init') {
    require('./configuration/server');
}

if (args.mode === 'test') {
    require('./executor');
}
