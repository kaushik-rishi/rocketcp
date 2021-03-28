const express = require('express');
const app = express();
app.set('view engine', 'ejs');

app.use('/', express.static('./static_dependencies'));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(8080, console.log('Listening on http://localhost:8080'));
