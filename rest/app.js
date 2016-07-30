const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const Horizon = require('@horizon/client')
const hz = Horizon({
    host: 'horizon:8181',
    secure: false,
    lazyWrites: false,
    authType: 'anonymous'
    // authType: 'token',
    // read token from Auth: Bearer header???
    // { token: <TOKEN>, storeLocally: false}
});
const messages = hz('messages');
hz.onReady(function() {
    console.log('Connected to Horizon Server!');
});
hz.connect();


app.get('/messages', function (req, res) {
    messages.order("datetime", "descending").limit(5).fetch().subscribe(
        docs => res.json(docs),
        err => {
            console.log(err);
            res.send(err);
        }
    );
});


app.post('/messages', function (req, res) {
    // TODO: schema enforcement
    // https://github.com/trainiac/express-jsonschema
    var body = req.body;
    body.datetime = Date();

    messages.store(body).subscribe(
        // Returns id of saved objects
        result => {
            console.log(result);
            res.json(result);
        },
        // Returns server error message
        error => {
            console.log(error);
            res.json(error);
        }
    );
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
