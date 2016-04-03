const readline = require('readline');
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});
var squel = require('../lastfm/crawler/squel');
var sql = squel.insert().into('discorgs');

var pg = require('pg');
var conString = "postgres://jack:bigdata@localhost/EnAsn";
var client = new pg.Client(conString);

client.connect(function(err){
	if (err){
		return console.log('could not connect to postgres', err);
	}

	var counter = 0;
	rl.on('line', (cmd) => {
		counter++;
		console.log('You just received: No.' + counter + ' data:');
		//console.log(cmd);
		var obj = JSON.parse(cmd);
		for (var myKey in obj){
			obj[myKey] = JSON.stringify(obj[myKey]);
		}
		sql.setFields(obj);
		console.log(sql.toString());
		client.query(sql.toString(), function(err){
			if (err) {
				console.log(err);
			}
		});
	});
});
