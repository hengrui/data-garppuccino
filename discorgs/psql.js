var pg = require('pg');
var conString = "postgres://jack:bigdata@localhost/EnAsn";
var client = new pg.Client(conString);
var fs = require('fs');
var squel = require('../lastfm/crawler/squel');

client.connect(function(err) {
	if (err) {
		return console.error('could not connect to postgres', err);
	}
	
	fs.readFile('./myData.json', 'utf8', function (err, data){
		if (err) {
			console.log(err);
		} else {
			var obj = JSON.parse(data);
			console.log(obj);
			for (i = 0; i < 1; i++){
				var sql = squel.insert().into('discorgs');
				var row = obj[i];
				console.log(row);
				for (var myKey in row){
					//sql.set(myKey, JSON.stringify(row[myKey]));
					row[myKey] = JSON.stringify(row[myKey]);
				}
				sql.setFields(row);
				console.log(sql.toString());
				client.query(sql.toString(), function(err){
					if (err){
						console.log(err);
					} 
					client.end();
				});
			}
		}
	});
});




/*
	var counter = 0;
	async.eachSeries(tasks, function(item, callback) {
		if (item == 'insertSQL2'){
			counter++;
			sqls[item] = sqls[item] + counter + ')';
		}
		console.log(item + ' ==> ' + sqls[item]);
		client.query(sqls[item], function(err, res){
			if (err) {
				console.error(err);
			}
			if (res.rows[0] != undefined){
				console.log(res.rows[0]);
				var item = res.rows[0];
				for (var myKey in item)
					counter = item[myKey];
			}
			callback(err, res, counter);
		});
	}, function(err){
		return console.log("err: " + err);
	});
});
*/
