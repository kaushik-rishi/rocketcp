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
    const args = { mode: defaultMode };
    if (parsed.query.lang) {
        if (Object.keys(global.config.languages).includes(parsed.query.lang))
            args.lang = parsed.query.lang;
        else throw new Error(chalk.red('Unknown lang : ' + parsed.query.lang));
    }
    if (parsed.query.dir) {
        args.dir = parsed.query.dir;
    }
    if (parsed.query.watch) {
        args.watch = true;
    }
    if (parsed.query.interactive) {
        args.interactive = true;
    }
    if (parsed.query['show-diff']) {
        args['show-diff'] = true;
    }
    return args;
};
