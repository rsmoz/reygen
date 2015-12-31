var express = require('express');
var app = express();
var fetch = require('request');
var fs = require('fs');
path = require('path');

//Eventually use build count to version resume?

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
			
			
			fs.writeFile(path.join(__dirname, 'target.json'), bod, function(err) {
				if(err) {
					return console.log(err);
				}

				console.log("The file was saved!");
				
				
				var filePath = path.join(__dirname, 'target.json');
				var stat = fs.statSync(filePath);

				response.writeHead(200, {
					'Content-Type': 'application/pdf',
					'Content-Length': stat.size
				});

				var readStream = fs.createReadStream(filePath);
				// We replaced all the event handlers with a simple call to readStream.pipe()
				readStream.pipe(response);
				
				
//				response.status(200).send("File saved");
			}); 
			
		}
	})
	
	
});

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});






