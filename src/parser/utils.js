const fileUtils = require('../fileUtils');

function commentifyMetaData(syntax, problemMetaData) {
    problemMetaData = syntax + problemMetaData;
    return problemMetaData.split('\n').join('\n' + syntax) + '\n\n';
}

function saveSamples(problemTestsDir, sampleTests, isInteractive) {
    const interactive = isInteractive ? 'interactive-' : '';
    sampleTests.forEach((test, index) => {
        fileUtils.createWrite(
            problemTestsDir,
            `${interactive}in${index + 1}.txt`,
            test.input
        );
        fileUtils.createWrite(
            problemTestsDir,
            `${interactive}out${index + 1}.txt`,
            test.output
        );
    });
}

function getProblemCode(problemName) {
    // TODO : return the problem code based on different cp platforms
    return problemName.split(' ')[0][0].trim();
}

function getFolderName(folderName) {
    // TODO : make folder based on different cp platforms
    var platform = folderName.split(' - ');
    return `${platform[0].trim()}/${platform.slice(1).join('-').trim()}`;
}

module.exports = {
    commentifyMetaData,
    saveSamples,
    getProblemCode,
    getFolderName
};
