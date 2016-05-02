var pg = require('pg');
var conString = process.env.DATABASEURL || "postgres://jack:bigdata@localhost:5432/EnAsn";
var client = new pg.Client(conString);
var fs = require('fs');
var squel = require('../../lastfm/crawler/squel');
var option = process.argv;
var filename = option[2];
var tablename = option[3];
var sql_insert = [];
var sql_num = 0;
var async = require('async');
var actual_id = 'rid';
var obj;

client.connect(function(err) {
	if (err) {
		return console.error('could not connect to postgres', err);
	}
	
	fs.readFile(filename, 'utf8', function (err, data){
		if (err) {
			console.log(err);
		} else {
			switch (tablename){
				case 'discogs_artist':
					console.log('artist');
					actual_id = 'aid';
					break;
				case 'discogs_release':
					console.log('release');
					actual_id = 'rid';
					break;
			}
			obj = JSON.parse(data);
			//console.log(obj);
			for (i = 0; i < obj.length; i++){
				var sql = squel.insert().into(tablename);
				var row = obj[i];
				var content = {};
				//console.log(row);
				if (row['error'] != undefined){
					continue;
				}
				for (var myKey in row){
					//sql.set(myKey, JSON.stringify(row[myKey]));
					if (myKey == 'tracklist'){
						var tracklist = row[myKey];
						for (var j = 0; j < tracklist.length; j++){
							if (tracklist[j]['duration'] != ''){
								var time = tracklist[j]['duration'].split(':');
								var time_in_sec = parseInt(time[time.length - 1], 10);
								var c = 0;
								for (var k = time.length-2; k > -1; k--){
									c++;
									var times = 1;
									for (var cc = 0; cc < c; cc++)
										times *= 60;
									time_in_sec += time[k] * times;
								}
								tracklist[j]['duration'] = time_in_sec;
							}
						}
						row[myKey] = tracklist;						
					}
					var t;
					if (typeof(row[myKey]) == 'string')
						t = row[myKey];
					else
						t = JSON.stringify(row[myKey]);
					if (myKey == 'id'){
						content[actual_id] = t;
					} else {
						content[myKey] = t;
					}
				}
				sql.setFields(content);
				sql_insert[sql_num] = sql.toString();
				sql_num++;
			}
			console.log(sql_num);
			var counter = -1;
			async.eachSeries(sql_insert, function(sql_insert, callback){
				counter++;
				//console.log(counter);
				//console.log(sql_insert);
				client.query(sql_insert, function(err, res){
					if (err) {
						console.log(err);
					}
					callback(null, res);
				});
			}, function(err){
				client.end();
				console.log('err: ' + err);
			});
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
