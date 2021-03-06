const { ArgumentParser } = require('argparse');
const { version } = require('../../package.json');
const UrlParser = require('./urlParser');

const modes = ['listen', 'init', 'test'];
const defaultMode = 'listen';

const parser = new ArgumentParser({
    description:
        'A command line client for parsing the test cases using the competitive companion extension and testing the users solution. 🎯'
});

parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('mode', {
    help: 'Allows the user to start RKTCP in different modes',
    type: String,
    choices: modes,
    nargs: '?',
    default: defaultMode
});
parser.add_argument('-l', '--lang', {
    help: 'OverRides the default language.',
    choices: Object.keys(global.config.languages)
});
parser.add_argument('-d', '--dir', {
    type: 'str',
    help: 'OverRides the default directory of operations.'
});
parser.add_argument('-u', '--url', {
    type: 'str',
    help: 'Store the url when launched using browser.'
});
parser.add_argument('-w', '--watch', {
    action: 'store_true',
    help: 'Used in test mode to run automatically when source code is updated'
});
parser.add_argument('-i', '--interactive', {
    action: 'store_true',
    help: 'Used in test mode to run the source code in a interactive way.'
});
parser.add_argument('--show-diff', {
    action: 'store_true',
    help:
        'Used in test mode to show the difference between current output and expected output.'
});

const preProcess = (args) => {
    if (args.url) {
        const newArgs = UrlParser.parse(args.url, modes, defaultMode);
        Object.keys(newArgs).forEach((key) => {
            args[key] = newArgs[key];
        });
    }
    if (args.lang) {
        global.config.defaultLanguage = args.lang;
    }
    if (args.dir) {
        global.config.mountPoint = args.dir;
    }

    global.args = args;
    return args;
};

const argParser = () => preProcess(parser.parse_args());
module.exports = argParser;
