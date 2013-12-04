var main = function (argument) {

	window.client = io.connect(window.location.href);

	client.on('temperature', function (data) {
		$("#temperature span").html(data);
	});

	client.on('light', function (data) {
		$("#light span").html(data);
	});

	client.on('led', function (data) {
		$("figure img").attr({src: data+".png"});
	});
	
}

function led(data)
{ 
    window.client.emit('led',{word: data});      
}

$(document).on('ready', main);