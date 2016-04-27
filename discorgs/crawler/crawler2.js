var crawler = require('./crawler_based_on_name_list.js');
var async = require('async');
var lock = 0;
var Discogs = require('disconnect').Client;
var db = new Discogs({userToken: 'UTmffTrAysekfTDiZXhTlSshcnkEiXHgmuisWyvv'}).database();
var line_by_line = require('n-readlines');
var liner = new line_by_line('./namelist.txt');
var searched_liner = new line_by_line('./searched_namelist.txt');
var Set = require('collections/set');
var fs = require('fs');
var params = {
	type: "release",
	artist: ""
};

(function(){
	//Get names from name list
	var searched_set = new Set();	
	while (line = searched_liner.next()){
		searched_set.add(line.toString('utf8'));
	}
	var namelist = [];
	while (line = liner.next()){
		var tmp = line.toString('utf8');
		if (!searched_set.has(tmp))
			namelist.push(tmp);
	}
	var name_num = namelist.length;
	var current_name = -1;
	var n = 1;
	var waiting_timer = 1;
	async.whilst(
		function () {return current_name < name_num;},
		function (callback) {
			current_name++;
			params['artist'] = namelist[current_name];
			setTimeout(function(){
				try{
					db.search(namelist[current_name], params, function(err, data){
						n = data.pagination.items;
						if (n != 0){
							waiting_timer = n + 7;
							crawler.crawler_by_name(namelist[current_name]);
						} else {
							waiting_timer = 1;
							console.log('No search result for ' + namelist[current_name]);
						}
						fs.appendFileSync('./searched_namelist.txt', namelist[current_name] + '\n');
						callback(null, current_name);
					});
				} catch (err) {
					console.log(err);
				}
			}, waiting_timer * 1000);
		},
		function (err, current_name){
			console.log('------- ' + current_name + ' names have been scaned.');
		});
})();

