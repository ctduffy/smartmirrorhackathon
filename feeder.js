var weather = require('weather-js');
var express = require('express');
var news = require('request');
var moment = require('moment');
var engines = require('consolidate');

var app = express();

app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates

// allow requests to JS/CSS files in local public/ directory
app.use(express.static(__dirname));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
	var headliner = '';
	var temp;
	var time = moment().format('LT');

	weather.find({search: "Charlottesville, VA", degreeType: 'F'}, function(err, result) {
		var pic = result[0].current.imageUrl;
		var high = result[0].forecast[1].high;
		var low = result[0].forecast[1].low;
	
		news('https://newsapi.org/v1/articles?source=the-wall-street-journal&apiKey=f2ebe1e3f87f4e7aadf7872b6c729bb9', function(error, response, body) {
				if (!error && response.statusCode == 200){
					//for each article, get headline, then put it into a string, so there is a v long string
					//then json that into it
					body = JSON.parse(body);

					for (var i = 0; i < body.articles.length; i++){
						headliner = headliner.concat(body.articles[i].title);
						headliner = headliner.concat('  •  ');
					}
			  		res.render("index.html", {headline: headliner, pic: pic, high: high, low: low, time: time, message: 'Good Evening'}); //mustache
				}
			})


	});

	
})

app.listen(3000, function(){
})

