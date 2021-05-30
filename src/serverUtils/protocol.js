const ProtocolRegistry = require('protocol-registry');
const chalk = require('chalk');

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

exports.decodeUrl = (url) => {
    console.log(url);
    return {};
};
