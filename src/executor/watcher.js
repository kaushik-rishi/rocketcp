const cluster = require('cluster');
const chokidar = require('chokidar');
const chalk = require('chalk');
const path = require('path');

const watcher = () => {
    if (!(cluster.isMaster && global.args.watch)) return false;

    const problemDir = process.cwd();
    const Lang = global.config.languages[global.config.defaultLanguage];

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
            cluster.workers[id].destroy();
        }
        cluster.fork();
    });
    return true;
};

module.exports = watcher;
