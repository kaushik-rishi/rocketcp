const express = require('express');
const router = express.Router();
const os = require('os');
const path = require('path');
const fs = require('fs');

const ROOT = path.join(os.userInfo().homedir, 'competitivecoding');

router.get('/', (req, res) => {
    res.render('index', process.env.config);
});

router.post('/', (req, res) => {
    try {
        fs.writeFileSync(
            path.join(ROOT, 'config.json'),
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
