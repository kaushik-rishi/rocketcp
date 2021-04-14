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
    let template = getTemplate(CodeLib[lang].templates[0]);
    defaultconfig.languages[lang] = {
        name: CodeLib[lang].name,
        isinterpreted: CodeLib[lang].isinterpreted,
        compile: CodeLib[lang].compile,
        run: CodeLib[lang].run,
        template,
        templateId: 0
    };
});

module.exports = defaultconfig;
