const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

const touchp = (filePath) => {
    const { dir } = path.parse(filePath);
    mkdirp.sync(dir);
    fs.writeFileSync(filePath, '');
};

module.exports = {
    touchp,
}
