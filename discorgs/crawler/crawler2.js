var crawler = require('./crawler_based_on_name_list.js');
var async = require('async');
var lock = 0;
var Discogs = require('disconnect').Client;
var db = new Discogs({userToken: 'UTmffTrAysekfTDiZXhTlSshcnkEiXHgmuisWyvv'}).database();
var line_by_line = require('n-readlines');
var liner = new line_by_line('./namelist.txt');

var params = {
	type: "release",
	artist: ""
};

(function(){
	//Get names from name list
	var namelist = [];
	while (line = liner.next()){
		namelist.push(line.toString('ascii'));
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
				db.search(namelist[current_name], params, function(err, data){
					n = data.pagination.items;
					if (n != 0){
						waiting_timer = n + 5;
						crawler.crawler_by_name(namelist[current_name]);
					} else {
						waiting_timer = 0.7;
						console.log('No search result for ' + namelist[current_name]);
					}
					callback(null, current_name);
				});
			}, waiting_timer * 1000);
		},
		function (err, current_name){
			console.log('------- ' + current_name + ' names have been scaned.');
		}
	);
})();

