const fs = require('fs');
const path = require('path');

module.exports = (template) => {
    if (!template.isFromFile) return template.content;
    return fs
        .readFileSync(path.join(process.env.srcAddress, template.content))
        .toString();
};
