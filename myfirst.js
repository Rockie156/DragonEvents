var http = require('http');

var fs = require('fs');
http.createServer(function (req, res){
    if(req.url === '/index.html'){
        fs.readFile('index.html',function(err,data) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(data);
            res.end();
        });
    }
    else if(req.url === '/css.css') {
        fs.readFile('css.css',function(err,data) {
            res.writeHead(200, {'Content-Type': "text/css"});
            res.write(data);
            res.end();
        });
    }
}).listen(8080);