const express = require('express')
const serveIndex = require('serve-index');
const path = require('path');
const app = express()

app.use('/public', serveIndex('files'));
app.use('/public', express.static('files'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'html\\index.html'))
})

app.listen(3000)