const express = require('express');
const { existsSync } = require('fs');
const { get } = require('https');
const { resolve } = require('path');

const expressApp = express();

expressApp.get('/', (req, res) => {
    res.sendFile(resolve('index.html'));
});

expressApp.get('/assets/*', (req, res) => {
    const filePath = resolve('.' + req.path);
    console.log(filePath);
    if (!existsSync(filePath)) {
        return res.status(404).end();
    }

    res.sendFile(filePath);
});
expressApp.get('/script.js', (req, res) => {
    console.log(resolve('script.js'));
    res.sendFile(resolve('script.js'));
});
expressApp.get('/style.css', (req, res) => {
    res.sendFile(resolve('style.css'));
});

expressApp.get('/get', (req, res) => {
    fetch();
    console.log(req.params);

    // get({});
});

const expressServer = expressApp.listen(4000);
