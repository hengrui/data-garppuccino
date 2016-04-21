var crawler = require('./crawler_based_on_name_list.js');
var namelist = ['Lady Gaga', 'Michael Jackson'];
var async = require('async');
var lock = 0;
var Discogs = require('disconnect').Client;
var db = new Discogs({userToken: 'UTmffTrAysekfTDiZXhTlSshcnkEiXHgmuisWyvv'}).database();

var params = {
	type: "release",
	artist: ""
};

(function(){
	var name_num = namelist.length;
	var current_name = -1;
	var n = 1;
	async.whilst(
		function () {return current_name < name_num;},
		function (callback) {
			current_name++;
			params['artist'] = namelist[current_name];
			setTimeout(function(){
				db.search(namelist[current_name], params, function(err, data){
					n = data.pagination.items;
					crawler.crawler_by_name(namelist[current_name]);
					callback(null, current_name);
				});
			}, n * 521);
		},
		function (err, current_name){
			console.log('------- ' + current_name + ' names have been scaned.');
		}
	);
})();
