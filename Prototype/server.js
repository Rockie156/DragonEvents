var http = require('http');
var express = require('express');
var pug = require('pug');
var database = require('./firebase.js');
require('express-session');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');


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
var fs = require('fs');
app.get('/test', function(req, res){
        var bucket = database.get_bucket();
        console.log(bucket);
        var file= fs.readFile("img/background.jpg");
        bucket.child("/img/background.jpg").put(file);
        res.send("Ok1");
        res.end();
        })
app.get('/events', function(req,res) {
    var db = database.get_connection();
	db.once('value', function(snapshot) {
        var events = snapshot.val().events;
        if (name){
            name = name.toLowerCase();
                for(var key in events) {
                    var event_name= events[key].name.toLowerCase();
            if(event_name.indexOf(name)== -1){
                delete events[key];
            
                }
                }
        }

        if (start_date){
            start_date= parseDate(start_date);
            for(var key in events) {
            var event_start= parseDate(events[key].start_date);
                if( event_start < start_date ){
                    delete events[key];
        
                }
            }
        }
            
        if (end_date){
            end_date= parseDate(end_date);
            for(var key in events) {
            var event_end = parseDate(events[key].end_date);
                if( event_end < end_date ){
                    delete events[key];
            
                }
            }
        }
		res.render('Events', {"events": events});
		res.end();
            }.bind({name: req.query.name, start_date: req.query.start_date, end_date: req.query.end_date})
            );
        
        
});

function parseDate(input) {
    var parts = input.split('-');
       return new Date(parts[0], parts[1]-1, parts[2]).getTime();
}

app.get('/view/:id', function(req,res) {
        var db = database.get_connection();
        var event_id = req.params.id;
        db.child('events').child(event_id)
        .once('value')
        .then(function(snapshot){
              if(snapshot.val()==null) {
                res.render("event_not_found");
                res.end();
              } else {
                res.render('view_event', {"event": snapshot.val()});
                res.end();
              }
    });
});

app.get('/about', function(req,res) {
	res.render('aboutus');
	res.end();
});

app.get('/login', function(req,res) {
	res.render('login');
	res.end();
});

app.get('/create_event', function(req, res) {
	res.render('create_event');
	res.end();
});

app.post('/submit', function(req, res) {
	var new_event_id = database.create_event(req.body);
	if (new_event_id) {
		console.log('Successfully created event!');
	}
	res.send('Coming soon...');
	res.end();
});

app.post('/submit_user', function(req, res) {
         req.body.secret=Math.floor(Math.random()* 100000) +1 ;
         var new_user_id = database.create_user(req.body);
         if (new_user_id) {
         console.log('Successfully created account!');
         }
         res.send('Coming soon...');
         res.end();
         });
	
app.listen(2080, function () {
    console.log('listening on port', 2080);
});
