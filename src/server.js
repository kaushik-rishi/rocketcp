const http = require('http');
const os = require('os');
const path = require('path');
const { touchp } = require('./touchp');

const HOME = (os.userInfo().homedir);
const ROOT = path.join(HOME, 'competitivecoding');
const FILE_EXT = ".cpp";

const server = http.createServer((req, res) => {
    let bodyBuffer = '';
    req.on('data', (chunk) => bodyBuffer += chunk)

    req.on('end', () => {
        const data = JSON.parse(bodyBuffer.toString());
        const { group: contestName, name: problemName, url: problemUrl } = data,
            problemCode = problemUrl.split('/').pop();
        touchp(path.join(ROOT, contestName, problemCode + FILE_EXT));
    });
});

const PORT_POST = 10045;
server.listen(PORT_POST, () => console.log(`Listening for Parsed problem POST requests on Port ${PORT_POST}`));