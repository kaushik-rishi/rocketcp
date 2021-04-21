#!/usr/bin/env node
'use strict';

// Code for the CLI App
require('./serverUtils/loadconfig');
const argParser = require('./serverUtils/argParser');

const args = argParser();

if (args.mode === 'listen') {
    require('./server');
}

if (args.mode === 'init') {
    require('./configuration/server');
}

if (args.mode === 'test') {
    require('./executor/index');
}
