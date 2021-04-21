const chalk = require('chalk');
const path = require('path');
const cluster = require('cluster');

const execute = require('./execute');
const watcher = require('./watcher');

if (cluster.isMaster && global.args.dir) {
    try {
        process.chdir(path.resolve(global.args.dir));
    } catch (e) {
        console.log(e);
        throw new Error(
            chalk.red(
                'Unable to mount on the provided directory!!!\n\nTerminating...'
            )
        );
    }
}

const problemDir = process.cwd();

const starting = () => {
    if (!global.args.watch) return;
    console.log(
        chalk.keyword('gray')(
            '[Watcher] Starting test for ' +
                global.config.defaultLanguage +
                '\n'
        )
    );
};

const finished = () => {
    if (!global.args.watch) return;
    console.log(
        chalk.keyword('gray')(
            '\n[Watcher] Test complete.\n[Watcher] Waiting for changes to restart...'
        )
    );
};

if (!watcher()) {
    starting();
    execute(global.config.defaultLanguage, problemDir);
    finished();

    // eslint-disable-next-line no-process-exit
    process.exit(0);
}
