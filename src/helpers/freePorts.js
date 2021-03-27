const fp = require('find-free-port');
const chalk = require('chalk');

const ports = [1327, 4244, 6174, 10042, 10043, 10045, 27121];

exports.getPort = () =>
    Promise.all(
        ports.map((p) =>
            fp(p, p + 1)
                .then(([freeP]) => freeP)
                .catch(() => false)
        )
    )
        .then((freePorts) => freePorts.filter(Boolean))
        .then((freePorts) => {
            if (freePorts.length === 0) {
                throw new Error('No Free Ports found.');
            }
            return freePorts[0];
        })
        .catch((e) => {
            console.log(chalk.red(e));
            console.log(
                '\n\nPlease Free any one of the bellow mentioned ports in your PC :\n'
            );
            ports.map((port) => {
                console.log(`\n${chalk.blue('==>')} ${port}`);
            });
        });
