#!/usr/bin/env node
'use strict';

// Code for the CLI App

const { ArgumentParser } = require('argparse');
const { version } = require('../package.json');

const parser = new ArgumentParser({
    description:
        'A command line client for parsing the test cases using the competitive companion extension and testing the users solution. 🎯'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('mode', {
    help: 'Allows the user to setup RCP properly',
    type: String,
    choices: ['listen', 'init', 'test'],
    nargs: '?',
    default: 'server'
});

let args = parser.parse_args();
if (args.mode === 'listen') {
    require('./server');
}

if (args.mode === 'init') {
    console.log('We are working on it');
}

if (args.mode === 'test') {
    require('./executor');
}
