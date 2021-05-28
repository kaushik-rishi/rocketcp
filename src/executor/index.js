const chalk = require('chalk');
const path = require('path');
const cluster = require('cluster');

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

require('./watcher');

const main = async () => {
    const execute = require('./execute');

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

    starting();
    await execute(global.config.defaultLanguage, problemDir);
    finished();
};
if (!(cluster.isMaster && global.args.watch)) {
    main().finally(() => {
        // eslint-disable-next-line no-process-exit
        process.exit(0);
    });
}
