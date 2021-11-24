const open = require('open');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const {checkRecurrentMovements} = require('./utils');

const fs = require('fs');

const app = express();

app.use(session({
	secret: 'ssshhhhh',
	saveUninitialized: true,
	resave: true
}));

// server css as static
app.use(express.static(__dirname + '/public'));

//setting the template manager
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const routes = require('./routes/routes.js')(app, fs);

const server = app.listen(3000, () => {
    console.log('listening on port %s...', server.address().port);
	checkRecurrentMovements(fs);
});

open(`http://127.0.0.1:${server.address().port}/`);