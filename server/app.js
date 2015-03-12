
/*
 * Module dependencies.
 */

// express up version
var express = require('express');
var http = require('http');
var net = require('net');
var socketio = require('socket.io');
var path = require('path');
var fs = require('fs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var os = require( 'os' );
var date = require('date-utils');
var exec = require('child_process').exec;
/*
exec('node -v', function (error, stdout, stderr) {
  // output is in stdout
  console.log('stdout: '+stdout);
});
*/

//var serialport = require("serialport").SerialPort;
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var sp = new SerialPort("/dev/ttymxc3", {
	baudRate: 115200,
	dataBits: 8,
	parity: 'none',
	stopBits: 1,
	flowControl: false,
	parser: serialport.parsers.raw

});

var app = express();
var HOST = 'localhost';			// MY PC

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.set('port', process.env.PORT || 3000);
//app.set('domain', 'myhost.whatever');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var net_PORT = 9000;	// net tcp server port number
process.setMaxListeners(0);

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

// app.get('/', routes.index);
app.get('/', function (req, res) {
	res.sendfile(__dirname + '/views/main.html');
});

app.get('/video', function (req, res) {
	res.sendfile(__dirname + '/views/video.html');
});

/*
app.get('/airgun', function (req, res) {
	res.sendfile(__dirname + '/views/airgun_0903.html');
});
*/

/*
var open = require('open');

open('http://localhost:3000', function (err) {
  if (err) throw err;
  console.log('The user closed the browser');
});
*/

/*
function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
	// var child = spawn(cmd);
	var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    child.stdout.on('end', function() { callBack (resp) });
}
*/

/**
 * Serial Port Setup.
 */
var serial_portName = '/dev/ttymxc3'; //This is the standard Udoo Serial port

//app.get('/', routes.main);
//app.get('/users', user.list);

// Address, Data File
var user_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/user.txt';

var validate_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/.validate.txt';
var validate_ps_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/.validate_ps.txt';
var validate_check_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/.validate_check.txt';

var mode_name_file_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/mode_name.txt';
var dev_mode_val = 0;
var mem_file_path =  '/home/ubuntu/testWeb/udoo-rice/public/receiveData/AVR_M_memory_Image_';	// 0 ~ 7
var fix_mem_file_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/AVR_M_memory_Image.txt';
var img_file_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/image_test.txt';
var pass_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/.ps.txt';

var log_path = '/home/ubuntu/testWeb/udoo-rice/public/receiveData/.exceptions.log';

var winston = require('winston');

var logger = new (winston.Logger)({
	transports: [
	  new (winston.transports.Console)(),
	],

	// 기존 위와 같이 transports property를 설정했듯이
	// exceptionHandlers Property를 설정하시고
	// 기존과 같이 transports를 추가하면 됩니다.
	exceptionHandlers: [
		new winston.transports.File({
		  filename: log_path
	  })
	]
});
/* Validate objects */
var date_vals = {
					stop_1: '0', stop_2: '0', stop_3: '0',
					stop_4: '0', stop_5: '0', stop_6: '0'
				};

var date_onoff_vals = 	{
							stop_1: 0, stop_2: 0, stop_3: 0,
							stop_4: 0, stop_5: 0, stop_6: 0
						};

var date_pass = {
					valid_1: '0', valid_2: '0', valid_3: '0',
					valid_4: '0', valid_5: '0', valid_6: '0'
				};

const accounts = 	{
						master:'1', admin:'2', engineer:'3'
					};

var pass_val = 	{
					master:'samoc', admin:'7942',
					engineer:'0000'
				};

var server_pass_protocol = 	{
								state:'', val: '', ack_flag: ''
							};

var tx_pass_protocol = 	{
							state:'', val: '', ack_flag: ''
						};

var html_protocol = {
						STX:2, ID:'00', COMMAND:'0', LENGTH:0, ETX:3, SUM_CHECK:0,
						ADDRESS:' ', VAL: ' ', TEXT:' ', RESULT_SUM_CHECK:0 ,
						DEVICE_KEY:' ', ID_DEVICE:' ', SEND_REGISTER_PATH:'', RECEIVE_REGISTER_PATH:'',	SEND_IMAGE_PATH:'', RECEIVE_IMAGE_PATH:''
					};

var client_protocol = 	{
							STX:2, ID:'00',
							COMMAND:'0', LENGTH:0,  ETX:3, SUM_CHECK:0,
							TEXT:' ', RESULT_SUM_CHECK:0, ACK_NACK: '0',
							SEND_REGISTER_PATH:'', RECEIVE_REGISTER_PATH:'',
							SEND_IMAGE_PATH:'', RECEIVE_IMAGE_PATH:''
						};


var server_protocol = 	{
							STX:2, SUM_CHECK:0, RESULT_SUM_CHECK:0,
							ADDRESS:'', DATA:'', ACK_NACK: '0', ETX:3
						};

var ACK='8', NACK='9';
var ETX = 3;

var global_address_offset;
var global_int_data;
var global_vd_address_offset;
var global_vd_int_data;

function device_pass_init() {

	var pass_buf;

	fs.readFile(pass_path, function (err, data) {

		if (err) throw err;

		pass_buf = data.toString().split(':');

		console.log('line 209 pass_buf : ' + pass_buf);

		pass_val.master = pass_buf[1].toString();
		pass_val.admin = pass_buf[3].toString();
		pass_val.engineer = pass_buf[5].toString();

		console.log('line 215 pass_val.master : ' + pass_val.master);
		console.log('line 216 pass_val.admin : ' + pass_val.admin);
		console.log('line 217 pass_val.engineer : ' + pass_val.engineer);

	});

}

function device_mode_init() {

	var address_offset = '0x005';	// address
	var int_address_offset = parseInt(address_offset, 16);	// address_offset h to d
	var read_buffer = new Buffer(2); 	// data buffer of address
	var fd;

	fd = fs.openSync(fix_mem_file_path, 'rs+');		// hander openSync

	fs.read(fd, read_buffer, 0, read_buffer.length, int_address_offset*2, function(err, bytesRead, buffer) {

		if(err) throw err;

		dev_mode_val = buffer_data = parseInt(buffer,16)	// h to d
		console.log('dev_mode_val:'+ dev_mode_val);
		fs.close(fd);

	});

}

device_pass_init();
// device_mode_init();

//---------------------------------------------------------------------
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// socket.io
var io = socketio.listen(server);

var sockets=new Array();	// 연결된 소켓을 저장
var sockets_hw=new Array();	// 연결된 소켓의 하드웨어의 고정 IP 주소를 저장

function dec2hex(i)
{
	var result = "0000";
	if      (i >= 0    && i <= 15)    { result = "000" + i.toString(16); }
	else if (i >= 16   && i <= 255)   { result = "00"  + i.toString(16); }
	else if (i >= 256  && i <= 4095)  { result = "0"   + i.toString(16); }
	else if (i >= 4096 && i <= 65535) { result =         i.toString(16); }
	return result;
}

function html_parsing_test(data) {

	var buf = new Array(4);
	var data_buffer = new Array(40);
	var string =  new Array();
	var i = 0, j = 0, crc = 0;
	var length_str_len;
	var colon = ':';

	data_buffer = data.message.split(':');

	console.log('html_parsing test func..');
	console.log('data_buffer: '+data_buffer.toString());

	html_protocol.STX = data_buffer[0];		// STX
	//console.log('STX=' + html_protocol.STX);

	html_protocol.ID = data_buffer[1];		// ID
	//console.log("ID=" + html_protocol.ID );

	html_protocol.COMMAND = data_buffer[2];	// COMMAND
	//console.log("COMMAND=" + html_protocol.COMMAND );

	if(	html_protocol.COMMAND == ACK || html_protocol.COMMAND == NACK )
		return 1;

	string[i++] = html_protocol.STX.toString().charCodeAt(0);	// STX	'/2' 0x02
	string[i++] = colon.toString().charCodeAt(0);
	string[i++] = html_protocol.ID.toString().charCodeAt(0);	// NUM 	'1'	 0x31
	string[i++] = colon.toString().charCodeAt(0);
	string[i++] = html_protocol.COMMAND.toString().charCodeAt(0);	// COMMAND '6'	0x36
	string[i++] = colon.toString().charCodeAt(0);

	html_protocol.LENGTH = data_buffer[3];		// LENGTH
	console.log("LENGTH=" + html_protocol.LENGTH );
	for(var j=0; j<html_protocol.LENGTH.length; j++ ) {
		string[i++] = html_protocol.LENGTH.toString().charCodeAt(j);
	}
	string[i++] = colon.toString().charCodeAt(0);

	html_protocol.TEXT = data_buffer[4];		// TEXT
	console.log("TEXT=" + html_protocol.TEXT );

	for(var j=0; j<html_protocol.TEXT.length; j++ ) {
		string[i++] = html_protocol.TEXT.toString().charCodeAt(j);
	}
	string[i++] = colon.toString().charCodeAt(0);

	// CRC
	for(var j = 0; j < i; j++) {
		crc = crc^string[j];
	}

	// html_protocol.SUM_CHECK =
	// html_protocol.RESULT_SUM_CHECK =Math.floor(html_protocol.SUM_CHECK%10000);

	// console.log("check_sum=" +  html_protocol.SUM_CHECK );	// check sum value
	// console.log("check_sum_result=" + html_protocol.RESULT_SUM_CHECK);	// check sum result value( check sum%10000 )

	console.log('crc value: ' + crc);
	console.log('crc hex value: ' + dec2hex(crc));

	html_protocol.SUM_CHECK = crc;

	var crc_hex = dec2hex(crc);
	html_protocol.RESULT_SUM_CHECK = crc_hex.slice(2);

	return 1;
}

function html_parsing(data){

	var data_buffer = new Array(40);

	data_buffer = data.message.split(':');

	console.log('html_parsing func..');
	console.log('data_buffer: '+data_buffer.toString());


	html_protocol.STX = data_buffer[0];		// STX
	//console.log('STX=' + html_protocol.STX);
	html_protocol.SUM_CHECK = parseInt(html_protocol.STX);

	html_protocol.ID = data_buffer[1];		// ID
	//console.log("ID=" + html_protocol.ID );
	html_protocol.SUM_CHECK +=parseInt(html_protocol.ID);

	html_protocol.COMMAND = data_buffer[2];	// COMMAND
	//console.log("COMMAND=" + html_protocol.COMMAND );
	html_protocol.SUM_CHECK +=html_protocol.COMMAND.charCodeAt(0);

	if(	html_protocol.COMMAND == ACK || html_protocol.COMMAND == NACK )
		return 1;

	html_protocol.LENGTH = data_buffer[3];	// LENGTH
	//console.log("LENGTH=" + html_protocol.LENGTH );
	html_protocol.SUM_CHECK +=parseInt(html_protocol.LENGTH);


	html_protocol.TEXT = data_buffer[4];	// TEXT
	//console.log("TEXT=" + html_protocol.TEXT );

	for( var i=0; i <  html_protocol.LENGTH; i++){
		html_protocol.SUM_CHECK += html_protocol.TEXT.charCodeAt(i);
	}

	html_protocol.RESULT_SUM_CHECK =Math.floor(html_protocol.SUM_CHECK%10000);
	//console.log("check_sum=" +  html_protocol.SUM_CHECK );	// check sum value
	//console.log("check_sum_result=" + html_protocol.RESULT_SUM_CHECK);	// check sum result value( check sum%10000 )

	return 1;

}

function make_check_sum(){

	console.log('STX=' + html_protocol.STX);
	html_protocol.SUM_CHECK = parseInt(html_protocol.STX);

	console.log("ID=" + html_protocol.ID );
	html_protocol.SUM_CHECK +=parseInt(html_protocol.ID);

	console.log("COMMAND=" + html_protocol.COMMAND );
	html_protocol.SUM_CHECK +=html_protocol.COMMAND.charCodeAt(0);

	console.log("LENGTH=" + html_protocol.LENGTH );
	html_protocol.SUM_CHECK +=parseInt(html_protocol.LENGTH);

	console.log("TEXT=" + html_protocol.TEXT );
	for( var i=0; i <  html_protocol.LENGTH; i++){
		html_protocol.SUM_CHECK += html_protocol.TEXT.charCodeAt(i);
	}

	html_protocol.RESULT_SUM_CHECK =Math.floor(html_protocol.SUM_CHECK%10000);
	console.log("check_sum=" +  html_protocol.SUM_CHECK );	// check sum value
	console.log("check_sum_result=" + html_protocol.RESULT_SUM_CHECK);	// check sum result value( check sum%10000 )

	return 1;

}

// avr data => server
function client_parsing_test(data){

	var buf = new Array(4);
	var data_buffer = new Array(40);
	var string =  new Array();
	var i = 0, j = 0, crc = 0;
	var length_str_len;
	var colon = ':';

	data_buffer = data.split(':');

	console.log('avr_parsing func..');
	console.log('data_buffer: '+data_buffer.toString());

	client_protocol.STX = data_buffer[0];		// STX
	// console.log('Avr STX=' + client_protocol.STX);

	client_protocol.ID = data_buffer[1];		// ID
	//console.log("Avr ID=" + client_protocol.ID );

	client_protocol.COMMAND = data_buffer[2];	// COMMAND
	//console.log("Avr COMMAND=" + client_protocol.COMMAND );

	client_protocol.ACK_NACK = client_protocol.COMMAND;	// waitAck에서 AckNack 체크를 위해 저장.
	console.log('client_protocol.ACK_NACK ='+client_protocol.ACK_NACK );
	if ((client_protocol.ACK_NACK == ACK) || (client_protocol.ACK_NACK == NACK)) {
		return 1;
	}

	string[i++] = client_protocol.STX.toString().charCodeAt(0);	// STX	'/2' 0x02
	string[i++] = colon.toString().charCodeAt(0);
	string[i++] = client_protocol.ID.toString().charCodeAt(0);	// NUM 	'1'	 0x31
	string[i++] = colon.toString().charCodeAt(0);
	string[i++] = client_protocol.COMMAND.toString().charCodeAt(0);	// COMMAND '6'	0x36
	string[i++] = colon.toString().charCodeAt(0);

	client_protocol.LENGTH = data_buffer[3];	// LENGTH
	// console.log("Avr LENGTH=" + client_protocol.LENGTH );
	console.log("LENGTH=" + client_protocol.LENGTH );
	for(var j=0; j<client_protocol.LENGTH.length; j++ ) {
		string[i++] = client_protocol.LENGTH.toString().charCodeAt(j);
	}
	string[i++] = colon.toString().charCodeAt(0);

	client_protocol.TEXT = data_buffer[4];		// TEXT
	console.log("Avr TEXT=" + client_protocol.TEXT );

	for(var j=0; j<client_protocol.TEXT.length; j++ ) {
		string[i++] = client_protocol.TEXT.toString().charCodeAt(j);
	}
	string[i++] = colon.toString().charCodeAt(0);

	// CRC
	for(var j = 0; j < i; j++) {
		crc = crc^string[j];
	}

	/*
	console.log("Avr check_sum=" +  client_protocol.SUM_CHECK );	// check sum value
	console.log("Avr check_sum_result=" + client_protocol.RESULT_SUM_CHECK);	// check sum result value( check sum%10000 )

	if ((parseInt(client_protocol.SUM_CHECK))%1000 == client_protocol.RESULT_SUM_CHECK%1000){
	    client_protocol.ACK_NACK = ACK;
		console.log('Check Sum ACK !!!!!!!!!!!!!!!');
	} else {
		client_protocol.ACK_NACK = NACK;
		console.log('Check Sum NACK !!!!!!!!!!!!!!!');
	}

	if ( client_protocol.COMMAND == '5') {
		client_protocol.FILE_NAME = client_protocol.TEXT.slice(0,6);
	}
	*/
	return 1;

}

// avr data => server
function client_parsing(data){

	var data_buffer = new Array(4000);

	data_buffer = data.split(':');

	console.log('avr_parsing func..');
	console.log('data_buffer: '+data_buffer.toString());

	client_protocol.STX = data_buffer[0];		// STX
	//console.log('Avr STX=' + client_protocol.STX);
	client_protocol.SUM_CHECK = parseInt(client_protocol.STX);

	client_protocol.ID = data_buffer[1];		// ID
	//console.log("Avr ID=" + client_protocol.ID );
	client_protocol.SUM_CHECK +=parseInt(client_protocol.ID);

	client_protocol.COMMAND = data_buffer[2];	// COMMAND
	//console.log("Avr COMMAND=" + client_protocol.COMMAND );
	client_protocol.SUM_CHECK +=client_protocol.COMMAND.charCodeAt(0);

	client_protocol.ACK_NACK = client_protocol.COMMAND;	// waitAck에서 AckNack 체크를 위해 저장.
	console.log('client_protocol.ACK_NACK ='+client_protocol.ACK_NACK );
	if ((client_protocol.ACK_NACK == ACK) || (client_protocol.ACK_NACK == NACK)) {
		data_buffer = null;
		delete data_buffer;
		return 1;
	}

	client_protocol.LENGTH = data_buffer[3];	// LENGTH
	console.log("Avr LENGTH=" + client_protocol.LENGTH );
	client_protocol.SUM_CHECK +=parseInt(client_protocol.LENGTH);

	client_protocol.TEXT = data_buffer[4];		// TEXT
	console.log("Avr TEXT=" + client_protocol.TEXT );

	for ( var i=0; i <  client_protocol.LENGTH; i++) {
		client_protocol.SUM_CHECK += client_protocol.TEXT.charCodeAt(i);
	}

	client_protocol.RESULT_SUM_CHECK = Math.floor(client_protocol.SUM_CHECK%10000);
	//console.log("Avr check_sum=" +  client_protocol.SUM_CHECK );	// check sum value
	//console.log("Avr check_sum_result=" + client_protocol.RESULT_SUM_CHECK);	// check sum result value( check sum%10000 )

	if ((parseInt(client_protocol.SUM_CHECK))%1000 == client_protocol.RESULT_SUM_CHECK%1000){
	    client_protocol.ACK_NACK = ACK;
		console.log('Check Sum ACK !!!!!!!!!!!!!!!');
	} else {
		client_protocol.ACK_NACK = NACK;
		console.log('Check Sum NACK !!!!!!!!!!!!!!!');
	}

	return 1;
}

function send_AckNack(id, AckNack) {

	var sendAckNack;

	sendAckNack = html_protocol.STX + ':' + id + '::' + AckNack + ':::' + '\0';

	io.sockets.emit('AckNack', { message: sendAckNack+'\0' });

}


//HTML -> Server File :AVR M_memory Image
function file_save_old( mode_val ){

	if( html_protocol.COMMAND == '4' ) {

		// File System Async
		fs.open(fix_mem_file_path, 'rs+', function(err, fd) {
			if(err) throw err;

			var address_offset = html_protocol.TEXT.slice(0,5);	// address
			global_address_offset = address_offset;
			var int_address_offset = parseInt(address_offset, 16);	// address_offset d to h
			var int_data = parseInt( html_protocol.TEXT.slice(5) );			// data string to decimal
			global_int_data = int_data; 	// data string to decimal
			var int_data_hex = int_data.toString(16);		// data decimal to hex

			// '0' + data(int_data_hex is string)
			if( int_data < 16 ) int_data_hex = '0' + int_data_hex;

			write_buffer = new Buffer(2);		// int_data_hex.length(2byte) size buffer
			write_buffer.write(int_data_hex, 0, 2);	// buffer to write
			console.log('write_buffer = ' + write_buffer);

			fs.write(fd, write_buffer, 0, write_buffer.length, int_address_offset*2, function(err, written, buffer) {
				if(err) throw err;
				console.log(err, written, buffer);
				fs.close(fd, function() {
					console.log('File Save Done');
				});
			});
		});

	} else if ( html_protocol.COMMAND == '1' ) {
		// File System Async
		fs.open(mem_file_path + mode_val + '.txt', 'rs+', function(err, fd) {

			if(err) throw err;

			var address_offset = html_protocol.TEXT.slice(0,5);	// address
			global_address_offset = address_offset;
			var int_address_offset = parseInt(address_offset, 16);	// address_offset d to h
			var int_data = parseInt( html_protocol.TEXT.slice(5) );			// data string to decimal
			global_int_data = int_data; 	// data string to decimal
			var int_data_hex = int_data.toString(16);		// data decimal to hex

			// '0' + data(int_data_hex is string)
			if( int_data < 16 ) int_data_hex = '0' + int_data_hex;

			write_buffer = new Buffer(2);		// int_data_hex.length(2byte) size buffer
			write_buffer.write(int_data_hex, 0, 2);	// buffer to write
			console.log('write_buffer = ' + write_buffer);

			fs.write(fd, write_buffer, 0, write_buffer.length, int_address_offset*2, function(err, written, buffer) {
				if(err) throw err;
				console.log(err, written, buffer);
				fs.close(fd, function() {
					console.log('File Save Done');
				});
			});
		});
	}
}

//HTML -> Server File :AVR M_memory Image
function file_save( mode_val ){

	var address_offset = html_protocol.TEXT.slice(0,5);	// address
	global_address_offset = address_offset;	// address
	var int_address_offset = parseInt(address_offset, 16);	// address_offset d to h
	var int_data = parseInt( html_protocol.TEXT.slice(5) );			// data string to decimal
	global_int_data = int_data;			// data string to decimal
	var int_data_hex = int_data.toString(16);		// data decimal to hex
	var fd;

	// '0' + data(int_data_hex is string)
	if( int_data < 16 ) int_data_hex = '0' + int_data_hex;

	console.log('\r\nFile save func . ')
	console.log('address_offset = ' + address_offset);
	console.log('int_data_hex = ' + int_data_hex);
	console.log('address_offset string to decimal = ' + int_address_offset );

	write_buffer = new Buffer(2);		// int_data_hex.length(2byte) size buffer
	write_buffer.write(int_data_hex, 0, 2);	// buffer to write

	console.log('write_buffer = ' + write_buffer);

	// File System Sync
	// Command 4 is mode_val, model object
	if( html_protocol.COMMAND == '4' ) fd = fs.openSync(fix_mem_file_path, 'rs+');
	else fd = fs.openSync( mem_file_path + mode_val + '.txt', 'rs+');	// File name+mode_val.txt				// hander openSync
	fs.writeSync(fd, write_buffer, 0, write_buffer.length, int_address_offset*2);		// writeSync
	fs.closeSync(fd);	// closeSync

}

//HTML -> Server File :AVR M_memory Image
function vd_file_save_old( ){

	if( html_protocol.COMMAND == '4') {

		// File System Async
		fs.open(fix_mem_file_path, 'rs+', function(err, fd) {
			if(err) throw err;

			var address_offset = html_protocol.TEXT.slice(0,5);	// address
			global_vd_address_offset = address_offset;
			var int_address_offset = parseInt(address_offset, 16);	// address_offset d to h
			var int_data = parseInt( html_protocol.TEXT.slice(5) );			// data string to decimal
			global_vd_int_data = int_data; 	// data string to decimal
			var int_data_hex = int_data.toString(16);		// data decimal to hex


			if( global_vd_address_offset == '0x201' || global_vd_address_offset == '0x600') {

				// '0' + data(int_data_hex is string)
				if( int_data < 16 ) int_data_hex = '0' + int_data_hex;

				write_buffer = new Buffer(2);		// int_data_hex.length(2byte) size buffer
				write_buffer.write(int_data_hex, 0, 2);	// buffer to write
				console.log('write_buffer = ' + write_buffer);

				fs.write(fd, write_buffer, 0, write_buffer.length, int_address_offset*2, function(err, written, buffer) {
					if(err) throw err;
					console.log(err, written, buffer);
					fs.close(fd, function() {
						console.log('File Close Done');
					});
				});
			} else {
				console.log('global_vd_address_offset is not eject, feed');
				fs.close(fd, function() {
					console.log('File Close Done');
				});
			}
		});

	} else if (html_protocol.COMMAND == '1') {

		var address_offset = html_protocol.TEXT.slice(0,5);	// address
		global_vd_address_offset = address_offset;
		var int_address_offset = parseInt(address_offset, 16);	// address_offset d to h
		var int_data = parseInt( html_protocol.TEXT.slice(5) );			// data string to decimal
		global_vd_int_data = int_data; 	// data string to decimal
		var int_data_hex = int_data.toString(16);		// data decimal to hex

		// '0' + data(int_data_hex is string)
		if( int_data < 16 ) int_data_hex = '0' + int_data_hex;

		write_buffer = new Buffer(2);		// int_data_hex.length(2byte) size buffer
		write_buffer.write(int_data_hex, 0, 2);	// buffer to write
		console.log('write_buffer = ' + write_buffer);

		// File System Async
		fs.open(mem_file_path + dev_mode_val + '.txt', 'rs+', function(err, fd) {
			if(err) throw err;

			fs.write(fd, write_buffer, 0, write_buffer.length, int_address_offset*2, function(err, written, buffer) {
				if(err) throw err;
				console.log(err, written, buffer);
				fs.close(fd, function() {
					console.log('Done');
				});
			});
		});
	}
}

//HTML -> Server File :AVR M_memory Image
function vd_file_save( ){

	var address_offset = html_protocol.TEXT.slice(0,5);	// address
	global_vd_address_offset = address_offset;
	var int_address_offset = parseInt(address_offset, 16);	// address_offset d to h
	var int_data = parseInt( html_protocol.TEXT.slice(5) );			// data string to decimal
	global_vd_int_data = int_data; 	// data string to decimal
	var int_data_hex = int_data.toString(16);		// data decimal to hex
	var fd;

	// '0' + data(int_data_hex is string)
	if( int_data < 16 ) int_data_hex = '0' + int_data_hex;


	/*
	console.log('\r\nFile save func . ')
	console.log('address_offset = ' + address_offset);
	console.log('int_data_hex = ' + int_data_hex);
	console.log('address_offset string to decimal = ' + int_address_offset );
	*/

	write_buffer = new Buffer(2);		// int_data_hex.length(2byte) size buffer
	write_buffer.write(int_data_hex, 0, 2);	// buffer to write

	//console.log('write_buffer = ' + write_buffer);

	if( html_protocol.COMMAND == '4') {

		if( global_vd_address_offset == '0x201' || global_vd_address_offset == '0x600') {
			// File System Sync
			fd = fs.openSync(fix_mem_file_path, 'rs+');
			fs.writeSync(fd, write_buffer, 0, write_buffer.length, int_address_offset*2);		// writeSync
			fs.closeSync(fd);	// closeSync
		}
		/*
		// File System Async
		fs.open(fix_mem_file_path, 'rs+', function(err, fd) {
			if(err) throw err;

			var address_offset = html_protocol.TEXT.slice(0,5);	// address
			global_vd_address_offset = address_offset;
			var int_address_offset = parseInt(address_offset, 16);	// address_offset d to h
			var int_data = parseInt( html_protocol.TEXT.slice(5) );			// data string to decimal
			global_vd_int_data = int_data; 	// data string to decimal
			var int_data_hex = int_data.toString(16);		// data decimal to hex


			if( global_vd_address_offset == '0x201' || global_vd_address_offset == '0x600') {

				// '0' + data(int_data_hex is string)
				if( int_data < 16 ) int_data_hex = '0' + int_data_hex;

				write_buffer = new Buffer(2);		// int_data_hex.length(2byte) size buffer
				write_buffer.write(int_data_hex, 0, 2);	// buffer to write
				console.log('write_buffer = ' + write_buffer);

				fs.write(fd, write_buffer, 0, write_buffer.length, int_address_offset*2, function(err, written, buffer) {
					if(err) throw err;
					console.log(err, written, buffer);
					fs.close(fd, function() {
						console.log('File Close Done');
					});
				});
			} else {
				console.log('global_vd_address_offset is not eject, feed');
				fs.close(fd, function() {
					console.log('File Close Done');
				});
			}
		});
		*/
	} else if (html_protocol.COMMAND == '1') {


		// File System Sync
		fd = fs.openSync( mem_file_path + dev_mode_val + '.txt', 'rs+');
		fs.writeSync(fd, write_buffer, 0, write_buffer.length, int_address_offset*2);		// writeSync
		fs.closeSync(fd);	// closeSync

		/*
		var address_offset = html_protocol.TEXT.slice(0,5);	// address
		global_vd_address_offset = address_offset;
		var int_address_offset = parseInt(address_offset, 16);	// address_offset d to h
		var int_data = parseInt( html_protocol.TEXT.slice(5) );			// data string to decimal
		global_vd_int_data = int_data; 	// data string to decimal
		var int_data_hex = int_data.toString(16);		// data decimal to hex

		// '0' + data(int_data_hex is string)
		if( int_data < 16 ) int_data_hex = '0' + int_data_hex;

		write_buffer = new Buffer(2);		// int_data_hex.length(2byte) size buffer
		write_buffer.write(int_data_hex, 0, 2);	// buffer to write
		console.log('write_buffer = ' + write_buffer);

		// File System Async
		fs.open(mem_file_path + dev_mode_val + '.txt', 'rs+', function(err, fd) {
			if(err) throw err;

			fs.write(fd, write_buffer, 0, write_buffer.length, int_address_offset*2, function(err, written, buffer) {
				if(err) throw err;
				console.log(err, written, buffer);
				fs.close(fd, function() {
					console.log('Done');
				});
			});
		});
		*/
	}
}

//HTML User data -> Server
function userData_save(user_data) {
	var fd = fs.openSync(user_path, 'w');	// File
	var w_buf = new Buffer(user_data.length);
	w_buf.write(user_data, 0, user_data.length)
	fs.writeSync(fd, w_buf, 0, w_buf.length, 0);		// writeSync
	fs.closeSync(fd);	// closeSync
}

//HTML Mode name -> Server
function mode_name_save(mode_name_text) {
	var fd = fs.openSync(mode_name_file_path, 'rs+');	// File
	var w_buf = new Buffer(mode_name_text.length);
	w_buf.write(mode_name_text, 0, mode_name_text.length)
	fs.writeSync(fd, w_buf, 0, w_buf.length, 0);		// writeSync
	fs.closeSync(fd);	// closeSync
}


//HTML Validate -> Server
function validate_all_save(validate_text) {
	var fd = fs.openSync(validate_path, 'w');	// File
	var w_buf = new Buffer(validate_text.length);
	w_buf.write(validate_text, 0, validate_text.length)
	fs.writeSync(fd, w_buf, 0, w_buf.length, 0);		// writeSync
	fs.closeSync(fd);	// closeSync
}


//HTML Validate Password -> Server
function validate_pass_save(validate_text) {
	var fd = fs.openSync(validate_ps_path, 'w');	// File
	var w_buf = new Buffer(validate_text.length);
	w_buf.write(validate_text, 0, validate_text.length)
	fs.writeSync(fd, w_buf, 0, w_buf.length, 0);		// writeSync
	fs.closeSync(fd);	// closeSync
}

//HTML Password -> Server
function password_save(pass_val) {
	var fd = fs.openSync(pass_path, 'w');	// File
	var w_buf = new Buffer(pass_val.length);
	w_buf.write(pass_val, 0, pass_val.length)
	fs.writeSync(fd, w_buf, 0, w_buf.length, 0);		// writeSync
	fs.closeSync(fd);	// closeSync
}

//HTML Validate -> Server
function validate_onoff_save(validate_text) {
	var fd = fs.openSync(validate_check_path, 'w');	// File
	var w_buf = new Buffer(validate_text.length);
	w_buf.write(validate_text, 0, validate_text.length)
	fs.writeSync(fd, w_buf, 0, w_buf.length, 0);		// writeSync
	fs.closeSync(fd);	// closeSync
}

function file_read_send_to_html_fix(dv_obj, dv_address, value, device_id, device_key) {

	// console.log('\nfile_read_send_to_html func..');
	var address_offset = dv_address;	// address
	var int_address_offset = parseInt(address_offset, 16);	// address_offset h to d
	var read_buffer = new Buffer(2); 	// data buffer of address
	var fd;

	fd = fs.openSync(fix_mem_file_path, 'rs+');		// hander openSync

	fs.read(fd, read_buffer, 0, read_buffer.length, int_address_offset*2, function(err, bytesRead, buffer) {

		if(err) throw err;

		var buffer_data = parseInt(buffer,16);	// h to d

		// console.log('buffer_data = ' + buffer_data);
		// console.log('address_offset = ' + address_offset);
		// console.log('address_offset string to decimal = ' + int_address_offset + '\n' );

		// server => web, socket_emit
		io.sockets.emit('read_server_mem_response', { DV_OBJ:dv_obj , DV_ADDR:dv_address, VAL:buffer_data, ID:device_id, KEY:device_key });
		fs.close(fd);
	});
}

function file_read_send_to_html(dv_obj, dv_address, value, device_id, device_key) {

	// console.log('\nfile_read_send_to_html func..');

	var address_offset = dv_address;	// address
	var int_address_offset = parseInt(address_offset, 16);	// address_offset h to d
	var read_buffer = new Buffer(2); 	// data buffer of address
	var fd;

	fd = fs.openSync(mem_file_path+dev_mode_val+'.txt', 'rs+');		// hander openSync

	fs.read(fd, read_buffer, 0, read_buffer.length, int_address_offset*2, function(err, bytesRead, buffer) {

		if(err) throw err;

		var buffer_data = parseInt(buffer,16);	// h to d

		// console.log('buffer_data = ' + buffer_data);
		// console.log('address_offset = ' + address_offset);
		// console.log('address_offset string to decimal = ' + int_address_offset + '\n' );

		// server => web, socket_emit
		io.sockets.emit('read_server_mem_response', { DV_OBJ:dv_obj , DV_ADDR:dv_address, VAL:buffer_data, ID:device_id, KEY:device_key });
		fs.close(fd);
	});

}

function file_read_send_to_html_fix_vd(dv_obj, dv_address, value, device_id, device_key) {

	// console.log('\nfile_read_send_to_html func..');

	var address_offset = dv_address;	// address
	var int_address_offset = parseInt(address_offset, 16);	// address_offset h to d
	var read_buffer = new Buffer(2); 	// data buffer of address
	var fd;

	fd = fs.openSync(fix_mem_file_path, 'rs+');		// hander openSync

	fs.read(fd, read_buffer, 0, read_buffer.length, int_address_offset*2, function(err, bytesRead, buffer) {

		if(err) throw err;

		var buffer_data = parseInt(buffer,16);	// h to d

		// console.log('buffer_data = ' + buffer_data);
		// console.log('address_offset = ' + address_offset);
		// console.log('address_offset string to decimal = ' + int_address_offset + '\n' );

		// server => web, socket_emit
		io.sockets.emit('read_server_mem_response_fix_vd', { DV_OBJ:dv_obj , DV_ADDR:dv_address, VAL:buffer_data, ID:device_id, KEY:device_key });
		fs.close(fd);
	});
}

function file_read_send_to_html_vd(dv_obj, dv_address, value, device_id, device_key) {

	console.log('\nfile_read_send_to_html_vd func..');

	var address_offset = dv_address;	// address
	var int_address_offset = parseInt(address_offset, 16);	// address_offset h to d
	var read_buffer = new Buffer(2); 	// data buffer of address
	var fd;

	fd = fs.openSync(mem_file_path+dev_mode_val+'.txt', 'rs+');				// hander openSync

	fs.read(fd, read_buffer, 0, read_buffer.length, int_address_offset*2, function(err, bytesRead, buffer) {

		if(err) throw err;

		var buffer_data = parseInt(buffer,16);	// h to d

		console.log('buffer_data = ' + buffer_data);
		console.log('address_offset = ' + address_offset);
		console.log('address_offset string to decimal = ' + int_address_offset + '\n' );

		// server => web, socket_emit
		io.sockets.emit('read_server_mem_response_vd', { DV_OBJ:dv_obj , DV_ADDR:dv_address, VAL:buffer_data, ID:device_id, KEY:device_key });
		fs.close(fd);
	});

}

function file_read_send_to_html_air(dv_obj, dv_address, value, device_id, device_key) {

	console.log('\nfile_read_send_to_html_air func..');

	var address_offset = dv_address;	// address
	var int_address_offset = parseInt(address_offset, 16);	// address_offset h to d
	var read_buffer = new Buffer(2); 	// data buffer of address
	var fd;

	fd = fs.openSync('public/receiveData/AVR_M_memory_Image.txt', 'rs+');				// hander openSync

	fs.read(fd, read_buffer, 0, read_buffer.length, int_address_offset*2, function(err, bytesRead, buffer) {

		if(err) throw err;

		var buffer_data = parseInt(buffer,16);	// h to d

		console.log('buffer_data = ' + buffer_data);
		console.log('address_offset = ' + address_offset);
		console.log('address_offset string to decimal = ' + int_address_offset + '\n' );

		// server => web, socket_emit
		io.sockets.emit('read_server_mem_response_air', { DV_OBJ:dv_obj , DV_ADDR:dv_address, VAL:buffer_data, ID:device_id, KEY:device_key });
		fs.close(fd);
	});

}

// command 3
function readFile() {

	var read_buffer;

	read_buffer = fs.readFileSync(html_protocol.RECEIVE_REGISTER_PATH, 'utf8');		// string <= File data
	io.sockets.emit('TextOut', { message: read_buffer });

	// server => html ACK tx
	send_AckNack(html_protocol.ID, ACK);

}

// command 4
function sendFileToClient() {

	var fileSize;

	console.log('cmd 4: sendFileToClient func.. !!' );

	fs.stat(html_protocol.SEND_REGISTER_PATH, function (err, stats) {
		fileSize = stats.size + 6;   // add file name 6 (= r0.txt )byte
		console.log('Length of fiseSize+html_protocol.FILE_NAME = ' + stats.size);
	});

	fs.readFile(html_protocol.SEND_REGISTER_PATH, function (err, data) {

		if (err) throw err;

		data = html_protocol.FILE_NAME + data; //append filename on data

		fileReadCheckSum(html_protocol.ID, html_protocol.COMMAND, data, fileSize);

		var tx_data = file_protocol.STX+':'+ file_protocol.ID + ':' + file_protocol.COMMAND +':'
			+ file_protocol.LENGTH+ ':' + file_protocol.TEXT + ':'
			+ file_protocol.SUM_CHECK + ':' + file_protocol.RESULT_SUM_CHECK + ':' + '\0';

		console.log('tx_data = ' + tx_data);

		sp.write(tx_data, function (err, bytesWritten) {

			if( err ) throw err;

			console.log('bytes Written:', bytesWritten);
			console.log('serial tx data:', tx_data);

		});

		/*	// TCP Write
		for( var i=0; i < sockets.length; i++ ) {
			sockets[i].write(file_protocol.STX+':'+ file_protocol.ID + ':' + file_protocol.COMMAND +':'
			+ file_protocol.LENGTH+ ':' + file_protocol.TEXT + ':'
			+ file_protocol.SUM_CHECK + ':' + file_protocol.RESULT_SUM_CHECK + ':' + '\0');
		}
		*/

	});

	/*
	var readFileStream = fs.createReadStream(html_protocol.REGISTER_PATH);		// create read stream
	var data;

	readFileStream.pipe(data);
	data = html_protocol.FILE_NAME + data; //append filename on data
	filesize = data.length;

	fileReadCheckSum(html_protocol.ID, html_protocol.COMMAND, data, fileSize);

	for( var i=0; i < sockets.length; i++ ) {
		sockets[i].write(client_protocol.STX+':'+ client_protocol.ID + ':' + client_protocol.COMMAND +':'
			+ client_protocol.LENGTH+ ':' + client_protocol.TEXT + ':'
			+ client_protocol.SUM_CHECK + ':' + client_protocol.RESULT_SUM_CHECK + ':' + '\0');
	}
	*/
}

function reciveFilefromClient(){

	console.log('Command 5: reciveFilefromClient() ');

	var writeStream = fs.createWriteStream(html_protocol.RECEIVE_REGISTER_PATH);

	var streamClose = function () {
		console.log('Command \'5\' Stream closed');
	};

	var streamCreate = function () {
		console.log('Command \'5\' Stream created');
	};

	var streamError = function (err){
		console.log('Command \'5\' Achtung achtung: ' + err);
	};

	writeStream.on('open', streamCreate);
	writeStream.on('close', streamClose);
	writeStream.on('error', streamError);

	writeStream.write(client_protocol.TEXT, 'utf8');
	writeStream.end();

	// server => html AckNack
	send_AckNack(html_protocol.ID, client_protocol.ACK_NACK);

}

// command 6
function readImageFile() {

	// var inpos = 0, width = 1024, height=100, smallWidth = 1024, smallHeight = 100;
	var Width = 1024, Height=200;
	var fileSize;

	fs.stat(html_protocol.FILE_NAME, function(err, stats) {

		fileSize = stats.size;   // add file name 6 (= r0.txt )byte
		console.log('File Size= ' + stats.size);

	});

	fs.readFile(html_protocol.FILE_NAME, function (err, data) {

		var read_buffer;
		var read_data='0';

		if (err) throw err;

		var dataBuf = new Buffer(data);
		var json = JSON.stringify(dataBuf);
		var sliceString;
		var sliceStringArry = [];
		var startBit=1, cnt=0;
		var color_offset=0;
		var length;

		for(var i=0; i<=json.length; i++) {

			if( (json.charAt(i) == ',') || (i==json.length) ) {

				sliceString = json.slice(startBit, i);
				startBit =(i+1);
				sliceStringArry.push(sliceString);

			}
		}

		// bmp_w = buf1[18]+buf1[19]*256;
		// bmp 파일 이미지 세로 크기
		// bmp_h = buf1[22]+buf1[23]*256;

		console.log("bmp_w = " + ( parseInt(sliceStringArry[18]) + parseInt(sliceStringArry[19])*256 ) );
		console.log("bmp_h = " + ( parseInt(sliceStringArry[22]) + parseInt(sliceStringArry[23])*256 ) );

		var inpos = 54;
		for (var y = 0; y < Height; y++) {

			//inpos = (width*3)*y;
			var dataSlice = [];

			for (var x = 0; x < (Width*3); x++) {
				dataSlice.push(sliceStringArry[inpos++]);
			}

			var data = dataSlice.toString();
			io.sockets.send(data);
		}

	});

	send_AckNack(html_protocol.ID, ACK);
}

var waitSend_ACK_Timer;
var imageSend_states = { wait_ack:1, send_image_length:2, send_image:3, send_done:5, next_state: 6};
var imageSend_state;

function WaitImageSend_machine(){

	switch(imageSend_state) {

		case imageSend_states.wait_ack:
				console.log('image_states.wait_ack');
				if( client_protocol.ACK_NACK == '0' ){
					imageSend_state = imageSend_states.wait_ack;
				}else{
					console.log('client_protocol.ACK_NACK = ACK');
					imageSend_state = imageSend_states.next_state;
				}
				break;

		case imageSend_states.send_image_length:
				console.log('image_states.send_image_length');

				imageLength();	// image length send
				client_protocol.ACK_NACK = '0';
				imageSend_states.next_state = imageSend_states.send_image;
				imageSend_state = imageSend_states.wait_ack;
				break;

		case imageSend_states.send_image:
				console.log('image_states.send_image');
				imagesend();	// image file send
				client_protocol.ACK_NACK = '0';

				imageSend_states.next_state = imageSend_states.send_done;
				imageSend_state = imageSend_states.wait_ack;
				break;

		case imageSend_states.send_done:
				console.log('image_states.send_done');
				clearInterval(waitSend_ACK_Timer);
				io.sockets.emit('ImageSendOK', {message: 'ImageSendOK'});
				break;

	}

}

// state = image_states.send_image_length
function imageLength(){

	var fileSize;

	console.log('File Path = ' +html_protocol.SEND_IMAGE_PATH);

	fs.stat(html_protocol.SEND_IMAGE_PATH, function(err, stats) {
		fileSize = stats.size; 					// fileSize
		console.log('File Size= ' + fileSize);
		for( var i=0; i < sockets.length; i++ ) {
			sockets[i].write( fileSize + '\0');		// Sent to the client (fileSize), TCP Write
		}
	});

}

// state = image_states.send_image
function imagesend(){

	var inpos = 0;
	var data;
	var dataSlice = [];

	// ==============send a file to the client====================
	console.log('ImageSend Func...');
	var fileStream = fs.createReadStream(html_protocol.SEND_IMAGE_PATH);		// create read stream

	fileStream.on('open', function() {
		console.log('File open Success');
		for( var i=0; i < sockets.length; i++ ) {
			fileStream.pipe(sockets[i], {end: false});
			// {end: false} pipe를 열린 상태로 유지.
		}
	});

	fileStream.on('error', function(err){
		console.log(err);
	});

	fileStream.on('end', function() {
		console.log('File Write Complete.');
	});

}

// Command 7
function sendImageFileToClient() {

	console.log('cmd 7: html_protocol.FILE_NAME = ' + html_protocol.FILE_NAME );

	client_protocol.ACK_NACK = '0';		// client_protocol.ACK_NACK INIT

	// Sent to the client, TCP Write
	for( var i=0; i < sockets.length; i++ ) {
		sockets[i].write(html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
			+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':'
			+ html_protocol.SUM_CHECK + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0');
	}

	imageSend_states.next_state = imageSend_states.send_image_length; 	// next state store
	imageSend_state = imageSend_states.wait_ack;

	waitSend_ACK_Timer = setInterval( WaitImageSend_machine, 50);

}

// command a
function reciveImageFileFromClient() {

	console.log('COMMAND a : ReadImageFileFromToClient Func..');

	// Sent to the client
	for( var i=0; i < sockets.length; i++ ) {
		sockets[i].write(html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
		+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':'
		+ html_protocol.SUM_CHECK + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0');
	}

}

function send_AckNack_Client(AckNack){

	html_protocol.COMMAND = AckNack;		// ACK or NACK store
	var tx_data = html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
						+ html_protocol.LENGTH+ ':' + html_protocol.ADDRESS + ':' +
						':' + html_protocol.VAL +':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0';

	sp.write(tx_data, function (err, bytesWritten) {

		if( err ) throw err;

		console.log('bytes written:', bytesWritten);

	});
	/*
	// Sent to the client
	for( var i=0; i < sockets.length; i++ ) {
		sockets[i].write(html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
						+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':'
						+ html_protocol.RESULT_SUM_CHECK + ':' + '\0');
	}
	*/
}

function make_tx_pass_protocol(state, val, ack_flag) {
	tx_pass_protocol.state = state;
	tx_pass_protocol.val = val;
	tx_pass_protocol.ack_flag = ack_flag;
}

function validate_data_send(socket) {

	fs.readFile(validate_path, function (err, data) {
		if (err) throw err;

		var validate_data = data.toString().split(',');

		console.log('validate data :' + validate_data.toString());

		var i=0;
		for(var key in date_vals) {
			date_vals[key] = validate_data[i++];
		}

		socket.emit('validate_read_response', validate_data);

	});

	fs.readFile(validate_ps_path, function (err, data) {

		if (err) throw err;

		var validate_ps = data.toString().split(',');

		console.log('validate password :' + validate_ps.toString());

		var i=0;
		for(var key in date_vals) {
			date_pass[key] = validate_ps[i++];
		}

		socket.emit('validate_pass_response', validate_ps);

	});

}

function user_name_init(socket) {
	console.log( 'user name init function .. ' );
	fs.readFile(user_path, function (err, data) {
		if (err) throw err;
		console.log( 'user name : '+ data );
		socket.emit('user_name_init', { name:data.toString() } );
	});
}

var client_Timer_machine;
var rx_client_states = { client_parsing:1, wait_ack:2, rx_client_image_length:3, rx_client_image_file_open:4, rx_client_image:5, rx_client_done:6, image_receive:7};
var rx_client_writeStream_close_flag = 0;
var rx_client_state = rx_client_states.client_parsing;

var rx_serial_data='';
var receive_length = 0;
var rx_serial_states = { init:'1', data:'2', image_receive:'3', image_receive_done:'4'};
var rx_serial_state = rx_serial_states.init;

var program_init_flag = 0;
var web_client_id = 	{
							local: 'localhost:3000'
						}
var web_sockets = new Array();

/* serial tx_data_array, serial tx_data_state start */
var tx_data_array = new Array();
var tx_states = { tx_data:0, ack_nack_check:1 };
var tx_state =  tx_states.tx_data;

var tx_vd_data_array = new Array();
var tx_vd_states = { tx_data:0, ack_nack_check:1 };
var tx_vd_state =  tx_vd_states.tx_data;
/* serial tx_data_array, serial tx_data_state end */
var img_recv_flag = 0;

var tx_vd_data_str;
var tx_vd_data_addr;

io.sockets.on('connection', function(socket) {

	console.log('Web Socket Client Connect');

	/*
	console.log('clientCount: ' + socket.conn.server.clientsCount);
	console.log('client Handshake: ' + socket.handshake.headers.host);
	*/


	socket.on('user_name_req', function() {
		user_name_init(socket);
	});

	socket.on('user_name_input', function(user_data) {
		console.log( 'user name : '+ user_data.name );
		userData_save(user_data.name);
	});

	socket.on('validate_pass_check', function(webData) {

		console.log( webData.idx +','+ webData.val);

		fs.readFile(validate_check_path, function (err, data) {

			if (err) throw err;

			var onoff_datas = data.toString().split(',');

			console.log('validate data :' + onoff_datas.toString());

			var i=0;
			for(var key in date_onoff_vals) {
				date_onoff_vals[key] = onoff_datas[i++];
			}


		});

		fs.readFile(validate_ps_path, function (err, data) {

			if (err) throw err;

			var validate_ps = data.toString().split(',');

			console.log('validate password data :' + validate_ps.toString());
			var validate_idx = 0, validate_idx_cnt = 0;
			var valid_ps_flag = false;

			for(var key in validate_ps) {

				if ( validate_ps[key].toString() == webData.val ) {
					validate_idx = validate_idx_cnt;

					if ( parseInt(date_onoff_vals['stop_'+(validate_idx+1)]) == 1 ) {
						valid_ps_flag = true;
					}
				}
				validate_idx_cnt++;

			}

			if ( valid_ps_flag == true ) {
				socket.emit('validate_pass_res', { idx : validate_idx, acknack: ACK});
			} else {
				socket.emit('validate_pass_res', { idx : validate_idx, acknack: NACK});
			}

		});
	});

	socket.on('validate_all_save', function(data) {

		var stop_date = data.stop_date;
		var date_text='';

		for(var key in date_vals) {
			date_vals[key] = stop_date[key];
			console.log('validate all save data: '
			+ date_vals[key]);
			date_text += date_vals[key] + ',';
		}
		validate_all_save(date_text);
		console.log('date_text: ' + date_text );
	});

	// validate read event: init
	socket.on('validate_pass_save', function(data){
		console.log('validate_pass_save event');
		validate_pass_save(data.toString());
	});

	// validate read event: init
	socket.on('validate_read', function(){
		console.log('validate_read event');
		validate_data_send(socket);
	});

	socket.on('validate_onoff_save', function(data){

		var date_str='';

		for(var key in data) {
			console.log( 'data['+key+'] : '+ data[key] );
			date_str += data[key]+',';
		}

		date_str = date_str.slice(0, -1);

		validate_onoff_save(date_str);
	});

	socket.on('validate_onoff_check', function(){
		fs.readFile(validate_check_path, function (err, data) {

			if (err) throw err;

			var onoff_datas = data.toString().split(',');

			console.log('validate data :' + onoff_datas.toString());

			var i=0;
			for(var key in date_onoff_vals) {
				date_onoff_vals[key] = onoff_datas[i++];
			}

			socket.emit('validate_onoff_response', date_onoff_vals);

		});
	});

	socket.emit('program_init_check', program_init_flag);

	socket.on('program_init_check_res', function(){
		program_init_flag = 1;
		console.log('program_init_flag : ' + program_init_flag );
	});

	// password init
	socket.on('password_init', function(data){
		/*
		console.log(data.state + ', ' + data.val);
		var pass_account = parseInt(data.state);
		var pass_val_string;

		switch(pass_account) {

			case 1: pass_val.master = data.val;
					break;
			case 2: pass_val.admin = data.val;
					break;
			case 3: pass_val.engineer = data.val;
					break;

			default : break;
		}
		*/

		var pass_account = parseInt(data.state);
		var pass_val_string;

		switch(pass_account) {

			case 2: pass_val.admin = '7942';
					break;
			case 3: pass_val.engineer = '0000';
					break;

			default : break;
		}

		pass_val_string = 	1+':'+pass_val.master+':'+
							2+':'+pass_val.admin+':'+
							3+':'+pass_val.engineer;

		password_save(pass_val_string);

		socket.emit('password_init_res', { account: data.state, iFlag: true });
	});

	// password check event
	socket.on('pass_val_check', function(data){
		console.log('pass_val_check :'+ data.state+','+ data.val);

		switch( data.state ) {

			case accounts.admin:
									if( pass_val.admin == data.val || pass_val.master == data.val ) {
										server_pass_protocol.ack_flag = '1';
										console.log('password check OK');
									} else {
										server_pass_protocol.ack_flag = '0';
										console.log('password check failed');
									}

									tx_pass_protocol.state = data.state;
									tx_pass_protocol.ack_flag = server_pass_protocol.ack_flag;

									// password check response: server -> html
									socket.emit('pass_check_res', {
										state: tx_pass_protocol.state,
										flag: tx_pass_protocol.ack_flag
									});

									break;

			case accounts.engineer:
									if( pass_val.engineer == data.val || pass_val.master == data.val ) {
										server_pass_protocol.ack_flag = '1';
										console.log('password check OK');
									} else {
										server_pass_protocol.ack_flag = '0';
										console.log('password check failed');
									}

									tx_pass_protocol.state = data.state;
									tx_pass_protocol.ack_flag = server_pass_protocol.ack_flag;

									// password check response: server -> html
									socket.emit('pass_check_res', {
										state: tx_pass_protocol.state,
										flag: tx_pass_protocol.ack_flag
									});
									break;

			default: break;
		}
	});

	socket.on('pass_change', function(data) {
		console.log('pass_change data: '+data.state+','+data.old_val+','+data.new_val);

		var account_state = data.state;

		switch( account_state ) {

			case accounts.admin: 	server_pass_protocol.state = account_state;

									// password change
									if( pass_val.admin == data.old_val ) {
										pass_val.admin = data.new_val;
										server_pass_protocol.ack_flag = '1';
									} else {
										server_pass_protocol.ack_flag = '0';
									}
									break;

			case accounts.engineer: server_pass_protocol.state = account_state;

									// password change
									if( pass_val.engineer == data.old_val ) {
										pass_val.engineer = data.new_val;
										server_pass_protocol.ack_flag = '1';
									} else {
										server_pass_protocol.ack_flag = '0';
									}
									break;

			default: break;
		}

		console.log('new password: '+pass_val.admin);
		console.log('new state: '+ server_pass_protocol.state);

		// password change value store
		if( server_pass_protocol.ack_flag == '1' ) {
			var pass_text =	1+':'+pass_val.master+':'+
							2+':'+pass_val.admin+':'+
							3+':'+pass_val.engineer;

			password_save(pass_text);
		}

		tx_pass_protocol.state = server_pass_protocol.state;
		tx_pass_protocol.ack_flag = server_pass_protocol.ack_flag;

		socket.emit('pass_change_res', {
			state: tx_pass_protocol.state,
			ack_flag: tx_pass_protocol.ack_flag
		});

	});

	socket.on('mode_name_read', function() {
		console.log('mode_name_read event');
		fs.readFile(mode_name_file_path, function (err, data) {
			if (err) throw err;
			console.log(data.toString());
			socket.emit('mode_name_res', data.toString() );
		});
	});

	socket.on('pass_store', function(data) {
		console.log('pass store data : ' + data);
	});

	socket.on('data_ev_vd', function(data){

		console.log('\r\ndata_ev_vd event(web=>node): ' + data.message);

		html_parsing(data);
		// vd_file_save();

		var tx_data = html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
			+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0';

		tx_vd_data_array.push(tx_data);
		//rx_serial_state = rx_serial_states.init;
		var vd_ack_wait_cnt=0;
		var vd_tx_state_cnt=0;

		var tx_vd_timer = setInterval( function() {

			if ( tx_vd_data_array.length >= 1 )  {

				console.log('tx_vd_timer length : '+tx_vd_data_array.length);
				switch(tx_vd_state) {

					case tx_vd_states.tx_data:

											console.log('tx_vd_states.tx_data');

											if( rx_serial_state != rx_serial_states.init ) {
												vd_tx_state_cnt++;
												tx_vd_state = tx_vd_states.tx_data;
												console.log('rx_serial_state is not init');

												if( vd_tx_state_cnt > 4000 ) {
													vd_tx_state_cnt = 0;

													var i = tx_vd_data_array.indexOf(tx_vd_data_array[0]);
													tx_vd_data_array.splice(i,1);
													tx_vd_state = tx_vd_states.tx_data;
													tx_vd_data_addr = '';
													rx_serial_state = rx_serial_states.init;

												}

											} else {

												tx_vd_state = tx_vd_states.ack_nack_check;
												rx_serial_state = rx_serial_states.init;
												sp.write(tx_vd_data_array[0] , function (err, bytesWritten) {
													if( err ) throw err;
													console.log('\nserial tx data:', tx_vd_data_array[0]);
													console.log('bytes Written:', bytesWritten+'\n');

													tx_vd_data_str = tx_vd_data_array[0].split(':');
													tx_vd_data_addr = tx_vd_data_str[4].toString().slice(0,5);
													console.log('tx_vd_data_addr : '+ tx_vd_data_addr);
												});
											}

											break;

					case tx_vd_states.ack_nack_check:

														console.log('tx_vd_states.ack_nack_check');
														if( client_protocol.ACK_NACK == ACK ) {
															client_protocol.ACK_NACK = '0';
															var i = tx_vd_data_array.indexOf(tx_vd_data_array[0]);
															tx_vd_data_array.splice(i,1);
															tx_vd_state = tx_vd_states.tx_data;
															tx_vd_data_addr = '';

														} else if( client_protocol.ACK_NACK == NACK ) {
															client_protocol.ACK_NACK = '0';
															tx_vd_state = tx_vd_states.tx_data;
														} else {
															vd_ack_wait_cnt++;
															if( vd_ack_wait_cnt > 4000 ) {
																vd_ack_wait_cnt=0;
																rx_serial_state = rx_serial_states.init;
																tx_vd_state = tx_vd_states.tx_data;
															}
														}

														break;

					default: break;

				}

			} else {
				clearInterval(tx_vd_timer);
				console.log('tx_vd_timer off');
			}

		}, 1);

	});

	socket.on('data_ev', function(data) {

		console.log('\r\ndata_ev event(web=>node): ' + data.message);

		html_parsing(data);
		var tx_data;
		var ack_wait_cnt=0;
		var tx_state_cnt=0;

		if( html_protocol.COMMAND == '1') {
			console.log('mode value: '+data.mode);
			dev_mode_val = data.mode;
			// file_save(data.mode);

			tx_data = html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
				+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0';

		}
		else if( html_protocol.COMMAND == '2') {	// command 2: avr memory read request


			tx_data = html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
				+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0';

		}
		else if( html_protocol.COMMAND == '3') {	// command 3: server_data_to_avr request

			console.log( 'Command 3 ' );

			fd = fs.openSync(mem_file_path, 'r');				// hander openSync
			fs.readFile(mem_file_path, function(err, data) {
				data = data.slice(256*2);	// 0 ~ 512 slice
				if(err) throw err;
				console.log(data);
				console.log(data.length);

				html_protocol.LENGTH = data.length;
				html_protocol.TEXT = data.toString();
				make_check_sum();

				tx_data = html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
					+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0';

				fs.closeSync(fd);
			});
		}
		else if( html_protocol.COMMAND == '4') {	// fix data

			console.log('mode value: '+data.mode);
			dev_mode_val = data.mode;
			// file_save(data.mode);

			tx_data = html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
				+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0';

		}
		else if( html_protocol.COMMAND == '5') {	// err check command
			tx_data = html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
				+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0';
		}

		tx_data_array.push(tx_data);
		var tx_timer = setInterval( function() {

			if ( tx_data_array.length >= 1 )  {

				// console.log(tx_data_array.length);

				switch(tx_state) {

					case tx_states.tx_data:
											if( rx_serial_state != rx_serial_states.init ) {
												tx_state = tx_states.tx_data;
											} else {
												tx_state = tx_states.ack_nack_check;
												sp.write(tx_data_array[0] , function (err, bytesWritten) {
													if( err ) throw err;

													console.log('\nserial tx data:', tx_data_array[0]);
													console.log('bytes Written:', bytesWritten+'\n');
												});
											}
											break;

					case tx_states.ack_nack_check:
													if( client_protocol.ACK_NACK == ACK ) {
														client_protocol.ACK_NACK = '0';
														var i = tx_data_array.indexOf(tx_data_array[0]);
														tx_data_array.splice(i,1);
														tx_state = tx_states.tx_data;
													} else if( client_protocol.ACK_NACK == NACK ) {
														client_protocol.ACK_NACK = '0';
														tx_state = tx_states.tx_data;
													} else {
														ack_wait_cnt++;
														if( ack_wait_cnt > 2000 ) {
															ack_wait_cnt=0;
															rx_serial_state = rx_serial_states.init;
															tx_state = tx_states.tx_data;
														}
													}
													break;

					default: break;

				}

			} else {
				clearInterval(tx_timer);
				console.log('tx_timer off');
			}

		}, 1);

	});

	// web -> server file read request event: fix data read( mode, model )
	socket.on('read_server_fix_mem_request', function(data){
		//console.log('read_server_fix_mem_request event');
		//console.log( 'data.DV_OBJ: '+ data.DV_OBJ +' data.DV_ADDR: '+data.DV_ADDR + ' data.VAL: ' + data.VAL + ' data.ID: ' + data.ID, ' data.KEY: ' + data.KEY);
		file_read_send_to_html_fix(data.DV_OBJ, data.DV_ADDR, data.VAL, data.ID, data.KEY);
	});

	// web -> server file read request event: main
	socket.on('read_server_mem_request', function(data){
		//console.log('read_server_mem_request event');
		//console.log( 'data.DV_OBJ: '+ data.DV_OBJ +' data.DV_ADDR: '+data.DV_ADDR + ' data.VAL: ' + data.VAL + ' data.ID: ' + data.ID, ' data.KEY: ' + data.KEY);
		file_read_send_to_html(data.DV_OBJ, data.DV_ADDR, data.VAL, data.ID, data.KEY);
	});

	// web -> server file fix memory read request event: video
	socket.on('read_server_fix_mem_request_vd', function(data){
		//console.log('read_server_mem_request event');
		//console.log( 'data.DV_OBJ: '+ data.DV_OBJ +' data.DV_ADDR: '+data.DV_ADDR + ' data.VAL: ' + data.VAL + ' data.ID: ' + data.ID, ' data.KEY: ' + data.KEY);
		file_read_send_to_html_fix_vd(data.DV_OBJ, data.DV_ADDR, data.VAL, data.ID, data.KEY);
	});

	// web -> server file read request event: video
	socket.on('read_server_mem_request_vd', function(data){
		//console.log('read_server_mem_request event');
		//console.log( 'data.DV_OBJ: '+ data.DV_OBJ +' data.DV_ADDR: '+data.DV_ADDR + ' data.VAL: ' + data.VAL + ' data.ID: ' + data.ID, ' data.KEY: ' + data.KEY);
		file_read_send_to_html_vd(data.DV_OBJ, data.DV_ADDR, data.VAL, data.ID, data.KEY);
	});

	// web -> server file read request event: airgun
	socket.on('read_server_mem_request_air', function(data){
		//console.log('read_server_mem_request event');
		//console.log( 'data.DV_OBJ: '+ data.DV_OBJ +' data.DV_ADDR: '+data.DV_ADDR + ' data.VAL: ' + data.VAL + ' data.ID: ' + data.ID, ' data.KEY: ' + data.KEY);
		file_read_send_to_html_air(data.DV_OBJ, data.DV_ADDR, data.VAL, data.ID, data.KEY);
	});

	// 	Video page Event: rx_serial_state=rx_serial_states.image_receive;
	socket.on('image_send', function (data) {

		console.log('Server Image Event: val::'+ data.val);

		// data.val:: component value
		if( data.val == 0 ) img_recv_stop_flag = 1;
		else img_recv_stop_flag = 0;

		/*
		// modify, 이미지 테스트를 위한 구문 line:964
		html_protocol.ID = data.ID;
		html_protocol.COMMAND = data.command;
		html_protocol.LENGTH = data.Length;
		html_protocol.TEXT = data.Text;

		make_check_sum();

		// sp.write
		var tx_data = html_protocol.STX+':'+ html_protocol.ID + ':' + html_protocol.COMMAND +':'
				+ html_protocol.LENGTH+ ':' + html_protocol.TEXT + ':' + html_protocol.RESULT_SUM_CHECK + ':' + '\0';

		sp.write(tx_data , function (err, bytesWritten) {

			if( err ) throw err;

			console.log('\nserial tx data:', tx_data);
			console.log('bytes Written:', bytesWritten+'\n');

		});
		*/

		rx_serial_state = rx_serial_states.image_receive;

	});

	socket.on('test_img', function(data) {

		console.log(data);
		/*
		var read_buffer;

		read_buffer = fs.readFileSync(img_file_path, 'utf8');
		io.sockets.emit('image_receive', read_buffer.toString() );
		delete read_buffer;
		*/
		/*
		fs.readFile(img_file_path, function(err, buf) {
			if(err) console.log(err);
			console.log(typeof(buf));
			console.log(buf);
			//io.sockets.emit('bin', buf );
		});
		*/

		/*
		var buf = new ArrayBuffer(1024*3);
		for(var i=0; i<buf.byteLength; i++)  {
			buf[i] = 0xA4;
		}
		var uint8View = new Uint8Array(buf);
		console.log(uint8View);
		socket.emit('bin', uint8View);
		delete buf;
		delete uint8View;

		*/
	});

	socket.on('help_req', function() {
		var ip_addr_wired = 'Not connected.';
		var ip_addr_wireless = 'Not connected.';
		var networkInterfaces = os.networkInterfaces();

		for( var i=0; i<9; i++ ) {

			// Wired Devices number
			if ( networkInterfaces['eth'+i] != undefined ) {
				ip_addr_wired = networkInterfaces['eth'+i][0].address;
				console.log( networkInterfaces['eth'+i][0] );
				break;
			}

			// Wireless Devices number
			if( networkInterfaces['wlan'+i] != undefined ) {
				ip_addr_wireless = networkInterfaces['wlan'+i][0].address;
				console.log( networkInterfaces['wlan'+i][0] );
				break;
			}
		}
		socket.emit('help_res', {wired: ip_addr_wired, wireless:ip_addr_wireless});

	});

	socket.on('date_and_time_config', function(data) {
		/*
		console.log('date config string : ' + data);
		var text="date config";
		run_cmd(data, [""], function(text) { console.log (text) });
		*/
		exec(data, function (error, stdout, stderr) {
			// output is in stdout
			console.log('stdout: '+stdout);
		});
	});

	socket.on('onboard_on', function() {

		exec('onboard', function (error, stdout, stderr) {
			// output is in stdout
			console.log('stdout: '+stdout);
		});
	});

	socket.on('mode_name_save', function(data) {
		console.log(data);
		mode_name_save(data);
	})

	socket.on('uncaughtException', function (err) {
		console.error(err.stack);
		console.log("Node NOT Exiting...")
		console.log('Caught exception: ' + error);
	});

	socket.on('error', function(err) {
		console.log(err);
	});

	socket.on('disconnect', function(){
        console.log('connection closed');
		var i = web_sockets.indexOf(socket);
		web_sockets.splice(i,1);
		console.log('length of sockets ' + sockets.length);

		tx_vd_data_array = [];
		tx_data_array = [];
		tx_vd_data_array.length=0;
		tx_data_array.length=0;
	});

});

sp.on('open', function () {

	console.log('port opened...');

	sp.flush( function (error) {
		if (error) {
			throw err;
			console.log('serial port error!!!');
		}
	});

	rx_serial_state = rx_serial_states.init;

});

// command 'a' variable, event - END ========================

// Add a 'data' event handler to this instance of socket
// Serial Port 에서 data 를 받을 경우. 이벤트 연결
// command 5,Ack,Nack, A
// rx_client_states = client_parsing


// Image Test variable
var img_write_flag = 0;
var img_fd;

sp.on('data', function (data) {

	//console.log('Rx_Data = ' + data);
	//console.log('Rx_state = ' + rx_serial_state);
	//console.log('Rx_Data length = ' + data.toString().length-1);

	// rx_serial_states = { init : '1', data:'2', image_receive:'3', image_receive_done:'4'};

	switch( rx_serial_state ){

		case rx_serial_states.init:

			rx_serial_data = data;

			if (  data.toString().charCodeAt(data.toString().length-1) == ETX ){
				console.log('rx_serial_states.init' );
				rx_serial_state = rx_serial_states.init;
			} else {
				rx_serial_state = rx_serial_states.data;
			}
			break;

		case rx_serial_states.data :

		    rx_serial_data = rx_serial_data + data;
			if ( data.toString().charCodeAt(data.toString().length-1) == ETX ) {
				console.log('rx_serial_states.init');
				rx_serial_state = rx_serial_states.init;

			} else {
				rx_serial_state = rx_serial_states.data;
			}
			break;

		case rx_serial_states.image_receive:

			// console.log('imagedata : '+ data);
			console.log('rx_serial_states.receive');
			img_recv_flag = 0;

			rx_serial_data += data;
			receive_length += data.length;

			if ( receive_length >= 1024*3*2 ) {	// 6k
													// 6k
				io.sockets.emit('image_receive', rx_serial_data);	// 6k
				console.log('rx_serial_data.length:'+rx_serial_data.length);
				console.log('receive_length : ' + receive_length);
				console.log('image_states.receive_done');

				rx_serial_state = rx_serial_states.image_receive_done;
				receive_length = 0;
				rx_serial_data='';
				img_recv_flag = 1;

				/*
				sp.flush( function (error) {
					if (error) {
						console.log('serial port error!!!');
						throw err;
					}
				});
				*/
			}
			break;

	}

	if ( rx_serial_state == rx_serial_states.init ){

		console.log('client_parsing');
		//client_parsing(data+ '\0');	// client data parsing

		client_parsing(rx_serial_data.toString());	// client data parsing

		if(client_protocol.COMMAND == '2') {

			console.log('\r=========================================');
			console.log('client_protocol.COMMAND == 2, data: ' + client_protocol.TEXT );
			io.sockets.emit('read_avr_val_response', { value: client_protocol.TEXT });

		} else if( client_protocol.COMMAND == '5' ) {
			console.log('\r\nclient_protocol.COMMAND == 5, Error Data: ' + client_protocol.TEXT +'\n');
			io.sockets.emit('err_check_response', client_protocol.TEXT);
		}

		/*
		if(client_protocol.COMMAND == 'D') {  //debug
			console.log('=====================	==============================');
			console.log('client_protocol.COMMAND == D, data: ' + client_protocol.TEXT );
		}
		*/

		// server -> HTML : ACK, NACK tx
		if( client_protocol.ACK_NACK == ACK ) {

			io.sockets.emit('Ack', { message: 'ACK' });
			console.log('sp.on :: Avr Ack Read Ok!!');

			if( tx_vd_data_addr == '0x429' || tx_vd_data_addr == '0x42A' ) {

				console.log('addr is 429 or 42A');

				rx_serial_state = rx_serial_states.image_receive;


			} else {
				// if (img_write_flag == 1) rx_serial_state = rx_serial_states.image_receive;
				// else rx_serial_state = rx_serial_states.init;
				rx_serial_state = rx_serial_states.init;
			}
		}
		else if ( client_protocol.ACK_NACK == NACK ) {
			io.sockets.emit('Nack', { message: 'NACK' });
			console.log('sp.on :: Avr NAck Read Ok!!');

			if( tx_vd_data_addr == '0x429' || tx_vd_data_addr == '0x42A' ) {

				console.log('vd_addr is 429 or 42A');
				rx_serial_state = rx_serial_states.init;

			}
			else {
				//if (img_write_flag == 1) rx_serial_state = rx_serial_states.image_receive;
				//else rx_serial_state = rx_serial_states.init;
				rx_serial_state = rx_serial_states.init;
			}

		}

		rx_serial_data = ''; 	//init
	}
	else if( rx_serial_state == rx_serial_states.image_receive_done ) {
		// image_receive_done
		rx_serial_state = rx_serial_states.init;
		console.log('image_receive_done!');
		// rx_serial_state = rx_serial_states.image_receive;
		// rx_serial_data = ''; 	//init

	}


});

sp.on('close', function (err) {
	console.log('port closed');
});

sp.on('error', function (err) {
	console.error("error", err);
});

/*
//-----------------------------------------------------------------------------------
net.createServer('connection', function(net_sock) {

	// We have a connection - a socket object is assigned to the connection automatically
	console.log('CONNECTED: ' + net_sock.remoteAddress +':'+ net_sock.remotePort);
	net_sock.name = net_sock.remoteAddress +':'+ net_sock.remotePort;

	sockets.push(net_sock);
	sockets_hw.push(net_sock.remoteAddress );
	net_sock.setNoDelay(true);

	var receive_length = 0;

	// Add a 'data' event handler to this instance of socket
	// TCP Client 에서 data 를 받을 경우. 이벤트 연결
	// command 5,Ack,Nack, A
	// rx_client_states = client_parsing

	net_sock.on('data', function(data) {

		switch(rx_client_state) {

			// parsing state
			case rx_client_states.client_parsing:

					client_parsing(data + '\0');	// client data parsing
					console.log('client_parsing');

					if( client_protocol.COMMAND == '5'){
						reciveFilefromClient();
						rx_client_state = rx_client_states.client_parsing;
					}

					// server -> HTML : ACK, NACK tx
					if( client_protocol.COMMAND == ACK || client_protocol.COMMAND == NACK ) {
						io.sockets.emit('AckNack', { message: data+'\0' });
						console.log('net_sock.on :: Client AckNack Read Ok!!');
						rx_client_state = rx_client_states.client_parsing;
					}

					break;

			// client_image_length state
			case rx_client_states.image_receive:

					receive_length += data.length;

					io.sockets.emit('image_receive', data.toString());

					console.log('imagedata : '+ data);

					if( receive_length >= 1024*3*2) {
						console.log('receive_length >= fileSize');
						console.log('image_states.receive_done');
						rx_client_state =rx_client_states.client_parsing;
						receive_length =0;
					}
					break;

			}

    });


	net_sock.on('uncaughtException', function (error) {
		console.error(err.stack);
		console.log("Node NOT Exiting...")
		console.log('Caught exception: ' + error);
	});

	net_sock.on('error', function(err) {
		console.log(err);
	});

	// Add a 'close' event handler to this instance of socket
	net_sock.on('close', function(data) {
		console.log('CLOSED: ' + net_sock.name);

		var i = sockets.indexOf(net_sock);
		sockets_hw.splice(i,1);
		sockets.splice(i,1);
		console.log('length of sockets ' + sockets.length);
	});

}).listen(net_PORT, HOST, function() {
	console.log('Server listening on ' + HOST +':'+ net_PORT);
});
*/
