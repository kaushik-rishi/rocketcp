#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

function createWrite(directory, fileName, contents) {
    if (!fs.existsSync(directory)) {
        return new Error(`The path ${directory} does not exist`)
    }
    fs.writeFileSync(path.join(directory, fileName), contents)
}

function write(directory, fileName, contents) {
    fs.writeFileSync(path.join(directory, fileName), contents)
}

module.exports = {
    createWrite,
    write
}
