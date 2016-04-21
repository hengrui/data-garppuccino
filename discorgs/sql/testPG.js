var async = require('async');
var pg = require('pg');
var conString = "postgres://jack:bigdata@localhost/EnAsn";
var client = new pg.Client(conString);

var sqls = {
	'insertSQL1': 'insert into weather(id, city, date) values(1, \'A\', \'2016-03-31\')',
	'selectSQL1': 'select max(id) from weather',
	'insertSQL2': 'insert into weather(city, date, id) values(\'D\', \'2016-03-31\', ',
	'selectSQL2': 'select max(id) from weather'
};

var tasks = ['insertSQL1', 'selectSQL1', 'insertSQL2', 'selectSQL2'];

client.connect(function(err) {
	if (err) {
		return console.error('could not connect to postgres', err);
	}
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

