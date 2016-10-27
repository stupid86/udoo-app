var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var ws = require("nodejs-websocket");
var net = require('net');
var fs = require('fs');
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/* 
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/
module.exports = app;


app.get('/', function (req, res) { 
	// res.send('hello world');
	res.sendfile(__dirname + '/views/main.html');
});

var http_port = 5555;
var server = http.createServer(app).listen(http_port, function(){
	console.log('Express server listening on port ' + http_port);
});

// Scream server example: "hi" -> "HI!!!" 
var ws_connection = new Array();
var ws_socket = ws.createServer(function (conn) {
	
	ws_connection.push(conn);
	
	console.log("New connection")
	conn.on("text", function (str) {
		
		var decoder_arr = str.split(',');
		// console.log(str.length);
		// console.log(decoder_arr.length);
		
		var binary_buf = ascii2binary(decoder_arr);
		console.log(binary_buf.length);
		console.log(binary_buf);
		
		sp.write(binary_buf , function (err) {
			if (err) throw err;
		});
		
		// var buffer = new ArrayBuffer(512);
		// buffer.write(binary_buf);
		
		// buffer.writeUInt8()
		// 부호 없는 1 byte 정수 배열
		// var uint8View = new Uint8Array(buffer);
		// console.log(uint8View);
		// console.log(buffer);
		
		// console.log(str);
		// console.log("Received "+str);
		// conn.sendText(str.toUpperCase()+"!!!");
	});
	
	conn.on("close", function (code, reason) {
		console.log("Connection closed");
		var i = ws_connection.indexOf(conn);
		ws_connection.splice(i,1);
	});
	
}).listen(3001);


var host_ip = 'localhost';
// var host_ip = '220.69.240.113';
// var host_ip = '192.168.11.7';
// var host_ip = '192.168.0.22';
// var host_ip = '220.69.240.117';
var image_path = "/public/images/video.bmp";
var wstream;
var file_states = { wait:0, read:1 };
var file_state = file_states.wait;
var protocols = { SOH:'\1', STX:'\2'};

var tcp_server = net.createServer( function(clnt_conn) { 
	
	console.log('client connected');
	
	var file_size = 0;		
	var dataBuff;
	
 
	clnt_conn.on('data', function(data) {
		
		// console.log(data);
				
		switch (file_state) {
			
			case file_states.wait:	
									if ( data == protocols.SOH ) {
										wstream = fs.createWriteStream(__dirname + image_path);
										file_state = file_states.read;
										
										clnt_conn.write(protocols.STX, function() {
											console.log("===== File Read Start");
										});
									}
									break;
			case file_states.read:	
									// console.log(data);		
									// var dataBuff = new Buffer(0);		
									file_size += data.length;
									wstream.write(data);
									
									if ( file_size >= 1416654 ) {
										
										console.log("============================");
										// console.log("dataBuff.length : " + dataBuff.length);
										// console.log("type dataBuff : " + typeof(dataBuff));
										// console.log("data.length : " + data.length);
										console.log("Receive Complete");
										console.log("file_size : " + file_size);
										console.log("type data : " + typeof(data));
										console.log("============================");
										console.log("===== File Read Wait");
										
										wstream.end();
																				
										file_size = 0;
										file_state = file_states.wait;
										
										wstream.on('close', function() {
											// io_sockets[0].emit('image_read_ok');	
											// websocket send 로 대체
										});
										
									}
									break;
									
		}
		
	});
	
	clnt_conn.on('end', function() {
		wstream.end();
		file_state = file_states.wait;
		console.log( 'client disconnected' );
	});
	
	// connection.write('Hello World!\r\n');
	// connection.pipe(connection);
	
});

tcp_server.listen(9000, host_ip, function() { 
	console.log('Server is listening');
});
