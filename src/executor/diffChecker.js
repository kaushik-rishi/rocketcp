const diff = require('fast-diff');
const chalk = require('chalk');

// trims the block of spaces at the end of a string
function rtrim(str) {
    if (str == null) return str;
    return str.replace(/\s+$/g, '');
}

function rtrimFullString(str) {
    return str
        .trim()
        .split('\n')
        .map((line) => rtrim(line))
        .join('\n');
}

function getDiffString(difference) {
    let diffString = '';
    difference.forEach((diffElement) => {
        if (diffElement[0] == 0) diffString += diffElement[1];
        else if (diffElement[0] == 1) diffString += chalk.green(diffElement[1]);
        else if (diffElement[0] == -1) diffString += chalk.red(diffElement[1]);
    });
    return diffString;
}

function getDifference(output, expectedOut) {
    output = rtrimFullString(output);
    expectedOut = rtrimFullString(expectedOut);

    let difference = diff(output, expectedOut);

    if (difference.length === 1 && difference[0][0] === 0) {
        // if no difference is encounteres the difference list looks like this : [ [ 0, 'samestring' ] ]
        return null;
    }

    return difference;
}

/* eslint-disable */
function test() {
    /*
    let ip, op
    // ip = '1             \n\n2'
    // op = '1                    \n2         '
    ip = '1             \n2\n'
    op = '1                    \n2         '
    getDifference(ip, op)
    */
    // console.log(getDiffString(getDifference('2\n3\n456', '2\n4\n908')))
}
/* eslint-disable */

// test()

module.exports = function(output, expectedOut) {
    return getDiffString(getDifference(output, expectedOut))
}
