const portToBusy = +process.argv[2]

if (portToBusy === NaN) {
    console.log('port must be an integer')
    process.exit(1)
}

const server = require('http').createServer()

server.listen(
    portToBusy,
    console.log(`Trying to keep the port ${portToBusy} busy...`)
)
server.on('error', (err) => console.log('😒 The port is already busy'))
