const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const os = require('os');

const TEMPLATE_DIR = path.join(os.userInfo().homedir, 'cp_templates');

const touchp = (filePath) => {
    const { dir } = path.parse(filePath);
    mkdirp.sync(dir);
    fs.writeFileSync(filePath, '');
};

module.exports = {
    touchp,
}
