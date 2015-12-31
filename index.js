var express = require('express');
var app = express();
var fetch = require('request');
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
	response.status(200).send('hello world');
});


//hackmyresume does not define a JS API, so I'm calling it from bash. Bleh.
app.get('/generate', function (request, response) {
	var source = request.param("json");
	fetch(source, function (err, resp, bod) {
		if (!err && resp.statusCode == 200) {
			console.log(bod);
			
			
			fs.writeFile("target.json", bod, function(err) {
				if(err) {
					return console.log(err);
				}

				console.log("The file was saved!");
				response.status(200).send("File saved");
			}); 
			
		}
	})
	
	
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});






