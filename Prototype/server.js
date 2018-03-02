var http = require('http');
var express = require('express');
var pug = require('pug');
var database = require('./firebase.js');
var session = require('express-session');
var bodyParser = require('body-parser');
var mailer = require('./mailer.js');

app = express();
app.set('view engine', 'pug');
app.use(express.static('.'));
app.use(session({
	secret: 'dragonevents',
    resave: true,
    saveUninitialized: true
	})
);
// Allows use of #{session.user}
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    var db = database.get_connection();
    db.child('events').limitToFirst(4).once('value', function(snapshot) {
		res.render('index', {"events": snapshot.val()});
		res.end();
    });
});

app.get('/events', function(req,res) {
    /** List all events and filter based on GET params **/
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
				var event_name = events[key].name.toLowerCase();
				if(event_name.indexOf(name) == -1) {
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
    });
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
				// TODO: event not found
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
	if (req.session.user!==undefined) {
		res.writeHead(302, {Location: "/"});
		res.end();
		return;
	}
    res.render('login');
    res.end();
});

app.get('/logout', function(req,res) {
	delete req.session.user;
    res.writeHead(302,  {Location: "/"});
	res.end();
});

app.get('/create_event', function(req, res) {
    res.render('create_event');
    res.end();
});

app.get('/register', function(req, res) {
	if (req.session.user!==undefined) {
		res.writeHead(302, {Location: "/"});
		res.end();
	}
	res.render('register');
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
                // TODO: user not confirmed
				res.send("Failed to confirm user");
				res.end();
			} else if (snapshot.val().secret != secret) {
                // TODO: user not confirmed
				res.send("Failed to confirm user");
				res.end();
			} else {
				database.confirm_user(user_id);
                // TODO: user confirmed
				res.send('success.');
				res.end();
			}
		}
	);
});

app.post('/is_unique_email', function(req,res) {
	var email = req.body.email.toLowerCase();
	var db = database.get_connection().child('users').orderByChild('email').equalTo(email);
	db.once('value', function(snapshot) {
		if (snapshot.numChildren() > 0) {
			res.send('Email is taken!');
			res.end();
		} else {
			res.send(true);
			res.end();
		}
    });
});

app.post('/submit_event', function(req, res) {
	// TODO modify start/end date to date objects combining date and time
    var new_event_id = database.create_event(req.body);
    res.send('Success.');
    res.end();
});

app.post('/submit_user', function(req, res) {
    req.body.secret = Math.floor(Math.random()* 100000) + 1;
	req.body.email = req.body.email.toLowerCase();
    var new_user_id = database.create_user(req.body);
	mail_options = {
		from: 'drexeldragonevents@gmail.com',
		to: req.body.email,
		subject: 'Confirm registration',
		text: "Click the following link to confirm your email: http://localhost:2080/confirm/" + new_user_id + "/" + req.body.secret
	};
	mailer.send_mail(mail_options);
    res.send('Success.');
    res.end();
});

app.post('/login', function(req, res) {
	var password = req.body.password;
	// minimal user input sanitizing
	req.body.email = req.body.email.toLowerCase();
	var db = database.get_connection();
	db.child('users').orderByChild('email').equalTo(req.body.email)
		.on('value', function(snapshot) {
			var user;
			for (item in snapshot.val()) {
				// really stupid way of getting the user
				user = snapshot.val()[item];
				break;
			}
			// check if password matches and user is confirmed
			if (user.password === password && user.is_confirmed === true) {
				req.session.user = user;
				res.send(true);
				res.end();
			} else {
				res.send('Invalid email/password combination.');
				res.end();
			}
	});
});

app.listen(2080, function () {
    console.log('listening on port', 2080);
});
