#!/usr/bin/env node

const http = require('http')
const parser = require('./parser')

const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/')
        return res.end('Sorry you are not allowed to access this method / url')

    let bodyBuffer = ''
    req.on('data', (chunk) => (bodyBuffer += chunk))

    req.on('end', async () => {
        const data = JSON.parse(bodyBuffer.toString())
        await parser(data)
    })
})

const PORT_POST = 10045
server.listen(PORT_POST, () =>
    console.log(
        `Listening for Parsed problem POST requests on Port ${PORT_POST}`
    )
)
