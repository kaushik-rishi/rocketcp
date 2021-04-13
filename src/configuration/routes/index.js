const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('index', global.config);
});

router.post('/', (req, res) => {
    try {
        fs.writeFileSync(
            process.env.configAddress,
            JSON.stringify(req.body, null, 4)
        );
        return res.status(200).json({
            err: false
        });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            err: true,
            msg: String(e)
        });
    }
});

module.exports = (app) => {
    app.use('/', router);
};
