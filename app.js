const open = require('open');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const simpleGit = require('simple-git');
const {checkRecurrentMovements} = require('./utils');

const fs = require('fs');

const app = express();
const git = simpleGit({baseDir: process.cwd(), binary: 'git', maxConcurrentProcesses: 6});

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

app.use(function (req, res, next) {
	let time = new Date().toLocaleString("it-IT", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
	console.log(`[${time}] chiamato ${req.originalUrl}`);
	next();
});

const server = app.listen(3000, () => {
    console.log('listening on port %s...', server.address().port);
	checkRecurrentMovements(fs);
});

checkUpdate().then(response => {
	var changes = response.summary.changes > 0;
	const routes = require('./routes/routes.js')(app, fs, changes);
	open(`http://127.0.0.1:${server.address().port}/`);
}).catch(err => {
	//console.log({err});
	const routes = require('./routes/routes.js')(app, fs, false);
	open(`http://127.0.0.1:${server.address().port}/`);
});

function checkUpdate() {
	return git.fetch().pull();
}