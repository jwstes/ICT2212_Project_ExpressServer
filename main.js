const express = require('express')
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const serveIndex = require('serve-index');
const https = require('https');



const tools = require('./lib/tools');

const app = express();

const sslOptions = {
    key: fs.readFileSync('/var/www/server.key'),
    cert: fs.readFileSync('/var/www/server.cert')
};



const port = 80;

app.use(session({
    secret: 'superS3cretL0!l!',
    resave: false,
    saveUninitialized: false
}));

app.engine('html', require('ejs').renderFile);
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set('layout', 'layout/main');

const conditionalStaticMiddleware = (basePath) => {
    const staticMiddleware = express.static(basePath);
    const indexMiddleware = serveIndex(basePath, { icons: true });

    return (req, res, next) => {
        staticMiddleware(req, res, (err) => {
            if (err) return next(err);

            fs.stat(path.join(basePath, req.path), (fsErr, stats) => {
                if (fsErr || !stats.isDirectory()) {
                    return next();
                }

                if (req.session['checkpointReached']) {
                    indexMiddleware(req, res, next);
                } else {
                    res.status(403).send('Access Denied');
                }
            });
        });
    };
};


app.use('/static', conditionalStaticMiddleware(path.join(__dirname, 'site')));
app.use('/zzon', serveIndex('hidden'));
app.use('/zzon', express.static('hidden'));

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/', async (req, res) => {
    res.redirect('/login');
})

app.get('/login', async (req, res) => {
    var sessionID = await tools.randomString();
    req.session['sessionID'] = sessionID;
    req.session['checkpointReached'] = false;
    req.session['allowEntryToken'] = "LOL";

    var alpha = await tools.generateRandomString();

    res.render('login', { layout:"layout/main",
        sessionID : sessionID,
        alpha : alpha });
})
app.post('/login', async (req, res) => {
    var data = req.body;
    var headers = req.headers;

    if(headers['_sid']){
        if(headers['_sid'] == req.session['sessionID']){
            var username = data['username'];
            var password = data['password'];
            var time = data['t'];
            var token = data['a'];

            if(token == req.session['token']){
                if(username == "lol" && password == "happy"){
                    res.status(200).send({"status" : 200, "_0x010101" : 200, "authenticated" : true, "t" : Date.now()});
                }
                else{
                    res.status(401).send({"status" : 401});
                }
            }
            else{
                res.status(401).send({"status" : 401});
            }
        }
        else{
            res.status(401).send({"status" : 401});
        }
    }
    else{
        res.status(401).send({"status" : 401});
    }
})

app.post('/getToken', async (req, res) => {
    var data = req.body;
    var headers = req.headers;
    if(headers['_sid']){
        if(headers['_sid'] == req.session['sessionID']){
            var bearerToken = await tools.randomString();

            res.cookie('_token', bearerToken, {
                httpOnly: false,
                secure: false,
                sameSite: 'Strict',
                expires: new Date(Date.now() + 86400000)
            });

            req.session['token'] = bearerToken;

            res.status(200).send({"status" : 200, "t" : Date.now()});
        }
        else{
            res.status(401).send({"status" : 401});
        }
    }
    else{
        res.status(401).send({"status" : 401});
    }
})

app.post('/:pl', async (req, res) => {
    var pl = req.params['pl'];
    var body = req.body;
    if(body['flag'] == 'AFTERLOVE'){
        if(pl.replace('_0x', '') == req.session['token']){
            var allowEntryToken = await tools.randomString();
            req.session['allowEntryToken'] = allowEntryToken;

            res.status(200).send({"status" : 200, "FLAG_MAGNUS" : allowEntryToken});
        }
        else{
            res.status(401).send({"status" : 401});
        }
    }
    else{
        res.status(401).send({"status" : 401});
    }

})

app.get('/:pl', async (req, res) =>{
    var pl = req.params['pl'];

    if(req.session['allowEntryToken'] == pl){
        req.session['checkpointReached'] = true;

        res.render('animal', { layout:"layout/main"});
    }
    else{
        res.status(404).send("Page Not Found (404).");
    }
})


const httpsServer = https.createServer(sslOptions, app);


// app.listen(port, '0.0.0.0', () => {
//     console.log(`Example app listening on port ${port}`)
// })

httpsServer.listen(443, '0.0.0.0', () => {
    console.log('HTTPS Server running on port 443');
});