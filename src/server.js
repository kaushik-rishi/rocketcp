const http = require('http')
const parser = require('./parser')
const ora = require('ora')

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

const PORT_POST = 10045
server.listen(PORT_POST, () => {
    console.log(`🚀 RKTCP up on port ${PORT_POST}`)
    spinner = ora('Incoming Problem').start()
})
