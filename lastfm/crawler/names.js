// names.js
var parse = require("csv-parse");
var fs = require('fs');

var csv_path = [
	"First_Names.csv",
	"Last_Names.csv"
	];

var prefixes = process.env.CSV_PREFIX || "../names/CSV_Database_of_";

csv_path[0] = prefixes + csv_path[0];
csv_path[1] = prefixes + csv_path[1];

var _ = module.exports = {};

_.Data = function(){
	this.firstnames = [];
	this.lastnames = [];

	var root = this;
	fs.createReadStream(csv_path[0]).pipe(
		parse({}, function(err, data){
			root.firstnames = data;
		})
		);
	// fs.createReadStream(__dirname+csv_path[0]).pipe(
	// 	parse({}, function(err, data){
	// 		console.log(data);
	// 		this.lastnames.push(data);
	// 	})
	// 	);
}