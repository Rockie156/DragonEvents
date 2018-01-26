var http = require('http');
var mysql = require('mysql');
var fs = require('fs');
var express = require('express');
var pug = require('pug');

app = express();
app.set('view engine', 'pug');

app.get('/test_db', function(req, res) {
		var events = [];
		var conn = get_connection();
		conn.connect();
		conn.query('SELECT name FROM events', function(err, rows, fields) {
			if (err) {
				res.status(500).json({"status_code": 500,"status_message": "internal server error"});
			} else {
				for (var i = 0; i < rows.length; i++) {
					events.push(rows[i].name);
				}
			}
			res.render('db_test', {"events":events});
		});
});

function get_connection() {
	return mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "1234",
		database: "test"
	});
}

app.listen(7080, function () {
    console.log('listening on port', 7080);
});



http.createServer(function (req, res){
    if(req.url === '/index.html'){
        fs.readFile('templates/index.html',function(err,data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    } else if(req.url === '/index.css') {
        fs.readFile('css/index.css',function(err,data) {
            res.writeHead(200, {'Content-Type': "text/css"});
            res.write(data);
            res.end();
        });
	} else {
		res.writeHead(404);
		res.write('Page not found.');
		res.end();
	}
}).listen(8080, function() {
	console.log('listening on port', 8080)
});