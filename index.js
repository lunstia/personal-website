const express = require('express');
const fs = require('node:fs');
const https = require('https');

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/lunstia.dev/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/lunstia.dev/fullchain.pem')
}

const app = express();

app.use(express.static(__dirname + '/static'));


https.createServer(options, app).listen(443);


