const express = require('express');
const router = express.Router();
const fs = require('fs');
const { validateConfig } = require('../../serverUtils/validator');
const getTemplate = require('../../serverUtils/gettemplate');

router.get('/', (req, res) => {
    res.render('index', global.config);
});

router.post('/', (req, res) => {
    try {
        let config = req.body;
        config.version = global.config.version;
        validateConfig(config);
        const langs = Object.keys(config.languages);
        Object.keys(global.config.languages).forEach((l) => {
            if (!langs.includes(l))
                throw new Error(l + ' is absent in configuration.');
        });
        fs.writeFileSync(
            process.env.configAddress,
            JSON.stringify(config, null, 4)
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

router.get('/template', (req, res) => {
    if (!req.query.path || req.query.path.length < 3)
        return res.status(200).json({
            err: true,
            msg: 'Path is a required query parameter'
        });
    try {
        const template = getTemplate({
            isFromFile: true,
            content: req.query.path
        });
        return res.status(200).json({
            err: false,
            template
        });
    } catch (e) {
        // console.log(e);
        res.status(200).json({
            err: true,
            msg: 'Template Not Found'
        });
    }
});

module.exports = (app) => {
    app.use('/', router);
};
