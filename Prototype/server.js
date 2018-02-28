var http = require('http');
var express = require('express');
var pug = require('pug');
var database = require('./firebase.js');
require('express-session');
var bodyParser = require('body-parser');
var mailer = require('./mailer.js');


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
    /** store GET parameters as local variables
	then bind them to the firebase call **/
    var name = req.query.name;
    var start_date = req.query.start_date;
    var end_date = req.query.end_date;

    var db = database.get_connection();

    db.once('value', function(snapshot) {
        var events = snapshot.val().events;
	// remove events that don't contain "name" as substring (case insensitive)
        if (name) {
            name = name.toLowerCase();
            for (var key in events) {
		var event_name= events[key].name.toLowerCase();
		if(event_name.indexOf(name)== -1) {
                    delete events[key];
                }
            }
        }
	// remove events that start before "start_date"
        if (start_date) {
            start_date = dateToMilliSeconds(start_date);
            for (var key in events) {
		var event_start = dateToMilliSeconds(events[key].start_date);
                if( event_start < start_date ) {
                    delete events[key];

                }
            }
        }
	// remove events that end after "end_date"
        if (end_date) {
            end_date = dateToMilliSeconds(end_date);
            for (var key in events) {
		var event_end = dateToMilliSeconds(events[key].end_date);
                if( event_end < end_date ) {
                    delete events[key];

                }
            }
        }
	res.render('Events', {"events": events});
	res.end();
    }.bind({name: name, start_date: start_date, end_date: end_date})
	   );


});

function dateToMilliSeconds(date) {
    /** Returns YYYY-MM-DD as time in milliseconds

    ARGS: input (string): YYYY-MM-DD

    RETURNS:
        integer: MS since epoch and input date **/
    var parts = input.split('-');
    return new Date(parts[0], parts[1]-1, parts[2]).getTime();
}

app.get('/view/:id', function(req,res) {
    var db = database.get_connection();
    var event_id = req.params.id;
    db.child('events').child(event_id)
        .once('value')
        .then(function(snapshot) {
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

app.get('/register', function(req, res) {
	res.render('register');
	res.end();
});

app.post('/validate_email', function(req, res) {
	// Returns if email is registered to another user or not
	// TODO search firebase and return true or false
	res.send('True');
	res.end();
});

app.get('/confirm/:user_id/:secret', function(req, res) {
	// Confirms an email
	var db = database.get_connection();
	var user_id = req.params.user_id;
	var secret = req.params.secret;
	db.child('users').child(user_id)
		.once('value')
		.then(function(snapshot) {
			if (snapshot.val() == null) {
				res.send("Failed to confirm user");
				res.end();
			} else if (snapshot.val().secret != secret) {
				res.send("Failed to confirm user");
				res.end();
			} else {
				database.confirm_user(user_id);
				res.send('ok');
				res.end();
			}
		}.bind({user_id:user_id, secret: secret})
	);
});

app.post('/is_unique_email', function(req,res) {
	console.log('call');
	var email = req.body.email;
	var db = database.get_connection();
	db.once('value', function(snapshot) {
		// really stupid way of checking object length
		// Should be fixed to something like users.length
		var num_users = snapshot.numChildren();
		var users = snapshot.val().users;
		// remove events that don't contain "name" as substring (case insensitive)
        email = email.toLowerCase();
        for (var id in users) {
			var user_email = users[id].email.toLowerCase();
			if(user_email != email) {
				num_users -= 1;
				delete users[id];
            }
        }
		if (num_users > 0) {
			console.log('Non-unique email: ' + email);
			res.send('Email is taken!');
			res.end();
		} else {
			console.log('unique email: ' + email);
			res.send('true');
			res.end();
		}
    }.bind({email: email}));
});

app.post('/submit_event', function(req, res) {
    var new_event_id = database.create_event(req.body);
    if (new_event_id) {
		console.log('Successfully created event!');
    }
    res.send('Coming soon...');
    res.end();
});

app.post('/submit_user', function(req, res) {
    req.body.secret=Math.floor(Math.random()* 100000) +1;
    var new_user_id = database.create_user(req.body);
    if (new_user_id) {
        console.log('Successfully created account!');
    }
	mail_options = {
		from: 'drexeldragonevents@gmail.com',
		to: req.body.email,
		subject: 'Confirm registration',
		text: "Click the following link to confirm your email: http://localhost:2080/confirm/" + new_user_id + "/" + req.body.secret
	};
	mailer.send_mail(mail_options);
    res.send('Coming soon...');
    res.end();
});

app.listen(2080, function () {
    console.log('listening on port', 2080);
});
