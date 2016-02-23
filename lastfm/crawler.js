var parseString = require('xml2js').parseString;
var request = require('request');
var express = require('express');
var morgan = require('morgan');
var app = express();

var xml = '<results for="believe">  <opensearch:Query role="request" searchTerms="believe" startPage="1"/>  <opensearch:totalResults>734</opensearch:totalResults>  <opensearch:startIndex>0</opensearch:startIndex>  <opensearch:itemsPerPage>20</opensearch:itemsPerPage>  <albummatches>    <album>      <name>Make Believe</name>      <artist>Weezer</artist>      <id>2025180</id>      <url>http://www.last.fm/music/Weezer/Make+Believe</url>      <image size=\"small">http://userserve-ak.last.fm/serve/34/8673675.jpg</image>      <image size="medium">http://userserve-ak.last.fm/serve/64/8673675.jpg</image>      <image size="large">http://userserve-ak.last.fm/serve/126/8673675.jpg</image>      <streamable>0</streamable>    </album>  </albummatches></results>"';
parseString(xml, function (err, result) {
    console.log(JSON.stringify(result));
});

var api_key = process.env.API_KEY || 'ad3f3423cdfb09e3e374c7ccf2c6c347';
var url = "http://ws.audioscrobbler.com/2.0/";

// app.use(bodyParser.json()); // for parsing application/json
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static("public"));
app.use(morgan('combined'));

//Adding libs
app.use("/lib", express.static("node_modules/"));
app.use("/css", express.static("node_modules/"));

app.get("/lastfm", function (req, res) {
	var params = req.query;
	for (var k in params) {
		console.log(k + " value " + params[k]);
	}
	params.api_key = api_key;
	params.format = 'json';
	request({uri: "", baseUrl: url, qs: params, json:true}, function(err, result, body) {
		if (err) {			
			console.log(err);
			res.status(result).send(body);
			return ;
		}
		// xml = body;
		// console.log(xml);
		// parseString(xml, function(err, result) {
		// 	if (err) {
		// 		console.log(err);
		// 		res.status(500).send(err);
		// 	}
		// 	else res.json(result);
		// })
		res.json(body);
	});
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log('listening ' + port);
});