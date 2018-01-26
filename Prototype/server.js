var http = require('http');

var fs = require('fs');

http.createServer(function (req, res){
    if(req.url === '/index.html'){
        fs.readFile('templates/index.html',function(err,data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
    else if(req.url === '/index.css') {
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
}).listen(8080);