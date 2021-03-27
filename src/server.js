const http = require('http')
const parser = require('./parser')
const ora = require('ora')
const freePorts = require('./serverUtils/freePorts')
const chalk = require('chalk')

let spinner

const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/')
        return res.end('Sorry you are not allowed to access this method / url')

    let bodyBuffer = ''

    req.on('data', (chunk) => (bodyBuffer += chunk))

    req.on('end', () => {
        const data = JSON.parse(bodyBuffer.toString())
        parser(data, spinner)
    })
})

freePorts.getPort().then((PORT_POST) => {
    if (PORT_POST !== undefined)
        server.listen(PORT_POST, () => {
            console.log(`🚀 RKTCP up on port ${PORT_POST}`)
            spinner = ora('Incoming Problem').start()
        })
    else console.log(chalk.red('\nNot able to listen for requests'))
})
