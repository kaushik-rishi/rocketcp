const express = require('express');
const freePorts = require('../serverUtils/freePorts');
const path = require('path');
const open = require('open');
const Router = require('./routes/index');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', express.static(path.join(__dirname, './static_dependencies')));

Router(app);

freePorts.getPort().then((PORT_POST) => {
    if (PORT_POST !== undefined)
        app.listen(PORT_POST, () => {
            console.log(`🚀 RKTCP Configuration up on port ${PORT_POST}`);
            open(`http://localhost:${PORT_POST}/`);
        });
});
