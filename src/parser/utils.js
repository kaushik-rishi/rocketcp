const fileUtils = require('../fileUtils')

function commentifyMetaData(problemMetaData) {
    // TODO : add comments based on language
    problemMetaData = '/*\n' + problemMetaData + '\n*/\n'
    return problemMetaData
}

function saveSamples(problemDir, sampleTests, isInteractive) {
    let interactive = isInteractive ? 'interactive-' : ''
    const testCases = []
    sampleTests.forEach((test, index) => {
        fileUtils.createWrite(
            problemDir,
            `${interactive}in${index + 1}.txt`,
            test.input
        )
        fileUtils.createWrite(
            problemDir,
            `${interactive}out${index + 1}.txt`,
            test.output
        )
        testCases.push({
            input: `${interactive}in${index + 1}.txt`,
            output: `${interactive}out${index + 1}.txt`
        })
    })
    return testCases
}

function getProblemCode(problemName) {
    // TODO : return the problem code based on different cp platforms
    return problemName.split(' ')[0][0].trim()
}

function getFolderName(folderName) {
    // TODO : make folder based on different cp platforms
    var platform = folderName.split(' - ')
    return platform[0].trim()
}

module.exports = {
    commentifyMetaData,
    saveSamples,
    getProblemCode,
    getFolderName
}
