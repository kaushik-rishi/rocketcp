const express = require('express');
const freePorts = require('../serverUtils/freePorts');
const app = express();
app.set('view engine', 'ejs');

app.use('/', express.static('./static_dependencies'));

app.get('/', (req, res) => {
    res.render('index');
});

freePorts.getPort().then((PORT_POST) => {
    if (PORT_POST !== undefined)
        app.listen(PORT_POST, () => {
            console.log(`🚀 RKTCP Configuration up on port ${PORT_POST}`);
        });
});
