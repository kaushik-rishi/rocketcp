const chalk = require('chalk');
const path = require('path');
const cluster = require('cluster');
const chokidar = require('chokidar');

const execute = require('./execute');

if (global.args.dir) {
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
const Lang = global.config.languages[global.config.defaultLanguage];

if (cluster.isMaster && global.args.watch) {
    console.log(
        chalk.gray(
            '[Watcher] Watching file : ' +
                path.join(problemDir, Lang.fileName + '\n')
        )
    );
    cluster.fork();
    let wait = false;
    chokidar.watch(path.join(problemDir, Lang.fileName)).on('change', () => {
        if (wait) return;
        wait = setTimeout(() => {
            wait = false;
        }, 500);
        console.log(
            chalk.keyword('gray')('\n[Watcher] Restarting due to changes...\n')
        );
        for (const id in cluster.workers) {
            console.log(id);
            cluster.workers[id].destroy();
        }
        cluster.fork();
    });
} else {
    console.log(
        chalk.keyword('gray')(
            '[Watcher] Starting test for ' +
                global.config.defaultLanguage +
                '\n'
        )
    );
    execute(global.config.defaultLanguage);
    console.log(
        chalk.keyword('gray')(
            '\n[Watcher] Test complete.\n[Watcher] Waiting for changes to restart...'
        )
    );
    // eslint-disable-next-line no-process-exit
    process.exit(0);
}
