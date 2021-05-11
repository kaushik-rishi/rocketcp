const CodeLib = require('./codeLib.json');
const getTemplate = require('./gettemplate');

const defaultconfig = {
    version: 1.0,
    defaultLanguage: 'cpp',
    languages: {},
    mountPoint: '.'
};

const Langs = Object.keys(CodeLib);

Langs.forEach((lang) => {
    const template = getTemplate(CodeLib[lang].templates[0]);
    defaultconfig.languages[lang] = {
        ...CodeLib[lang],
        template,
        templateId: 0
    };
});

module.exports = defaultconfig;
