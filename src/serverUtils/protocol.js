const ProtocolRegistry = require('protocol-registry');
const chalk = require('chalk');
const Url = require('url-parse');

exports.register = () => {
    return ProtocolRegistry.register({
        protocol: 'rktcp',
        command: 'rktcp --url="$_URL_"',
        terminal: true,
        script: true,
        override: true
    }).catch((e) => {
        console.log(e);
        console.log(chalk.red('Unable to register rktcp protocol'));
    });
};

exports.decodeUrl = (url, modes, defaultMode) => {
    const parsed = Url(url, true);
    if (modes.includes(parsed.hostname)) defaultMode = parsed.hostname;
    return { mode: defaultMode, ...parsed.query };
};
