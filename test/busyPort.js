const http = require('http')
const ports = process.argv.slice(2).filter(portNumber => !isNaN(portNumber))

const servers = []
for (let i = 0; i < ports.length; ++i)
    servers.push(http.createServer())

const alreadyBusy = []

ports.forEach((portNumber, index) => {
    servers[index].listen(portNumber, console.log(`Keeping port ${portNumber} busy\n`))
    servers[index].on('error', (err) => console.log(`Port ${portNumber} is already busy\n`))
})