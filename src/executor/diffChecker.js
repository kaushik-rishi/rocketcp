const diff = require('fast-diff')

// trims the block of spaces at the end of a string
function rtrim(str) {
    if (str == null) return str
    return str.replace(/\s+$/g, '')
}

// returns wether the solution matches the test or not
function match(sol, test) {
    // TODO : use better diff algorithm or diff package to show the difference
    if (!sol) return false

    sol = sol.split('\n')
    test = test.split('\n')

    if (sol.length < test.length) return false

    for (let i = 0; i < test.length; i += 1)
        if (rtrim(sol[i]) != rtrim(test[i])) return false

    return true
}

function getDifference(output, expectedOut) {
    console.log(output)
    console.log(expectedOut)

    output = output
        .trim()
        .split('\n')
        .map((line) => rtrim(line))
        .join('\n')
    expectedOut = expectedOut
        .trim()
        .split('\n')
        .map((line) => rtrim(line))
        .join('\n')

    console.log('\n-----------------\n')
    console.log(output)
    console.log(expectedOut)

    let difference = diff(output, expectedOut)
    console.log(difference)
    return difference
}

function test() {
    let ip, op
    // ip = '1             \n\n2'
    // op = '1                    \n2         '
    ip = '1             \n2\n'
    op = '1                    \n2         '
    getDifference(ip, op)
}

test()

module.exports = {
    match,
    getDifference
}
