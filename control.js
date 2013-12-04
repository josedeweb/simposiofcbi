var five = require("johnny-five"), led;
var sleep = require('sleep'),
	express = require('express'),
	app     = express(),
	server  = require('http').createServer(app),
	io      = require('socket.io').listen(server),
	cons    = require('consolidate');

app.engine('.html', cons.jade);
app.set('view engine', 'html');
app.use(express.static('./public'));

app.get('/', function(req, res){
  	res.render('index',{
  		titulo : "Real time"
  	});
});

server.listen(3000);

five.Board().on("ready", function() {

  	var sensor = new five.Sensor("A0");
  	var light = new five.Sensor("A1");
  	var enable = true;  	

	led = new five.Led({
		pin: 13
	});

	sensor.on("data", function() {  	
		var voltage = this.value * 0.004882814;
	    var celsius = (voltage * 100);	    
	    //console.log("Temperatura: "+celsius);
	    io.sockets.in('room').emit('temperature', celsius);
		if(celsius>30){
			led.on();						
			io.sockets.in('room').emit('led', 'red');	
		}
		else if(enable){
			led.off();				
			io.sockets.in('room').emit('led', 'green');	
		}			
		sleep.usleep(500000);
	});

	light.on("data", function(){
	  	//console.log("Luz: "+this.value);	
	  	io.sockets.in('room').emit('light', this.value);	
	});

	io.sockets.on('connection', function (socket) {	
		socket.join('room');
		socket.on('led', function(data){			
			if (data.word=="encender") {
				led.on();
				io.sockets.in('room').emit('led', 'red');	
				enable=false;				
			}
			else if(data.word=="apagar"){
				led.off();		
				io.sockets.in('room').emit('led', 'green');			
				enable=true;		
			}
		});
	});

});