var http = require('http');
var express = require('express');
var pug = require('pug');
var database = require('./firebase.js');
require('express-session');
var bodyParser = require('body-parser');

app = express();
app.set('view engine', 'pug');
app.use(express.static('.'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


app.get('/test_firebase', function(req, res) {
	var db = database.get_connection();
	db.once('value', function(snapshot) {
		res.render('db_test', {"events": snapshot.val().events});
		res.end();
	});
});

app.get('/', function(req, res) {
	var db = database.get_connection();
	db.once('value', function(snapshot) {
		res.render('index', {"events": snapshot.val().events});
		res.end();
	});
});

app.get('/events', function(req,res) {
	var db = database.get_connection();
	db.once('value', function(snapshot) {
		res.render('Events', {"events": snapshot.val().events});
		res.end();
	});
});

app.get('/create_event', function(req, res) {
	res.render('create_event');
	res.end();
});

app.post('/submit', function(req, res) {
	var new_event_id = database.create_event(req.body.name, req.body.description, req.body.start_date, req.body.end_date, "default_user");
	if (new_event_id) {
		console.log('Successfully created event!');
	}
	res.send('Coming soon...');
	res.end();
});
	
app.listen(2080, function () {
    console.log('listening on port', 2080);
});