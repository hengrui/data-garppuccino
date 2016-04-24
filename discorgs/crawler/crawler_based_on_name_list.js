var Discogs = require('disconnect').Client;
var db = new Discogs({userToken: 'UTmffTrAysekfTDiZXhTlSshcnkEiXHgmuisWyvv'}).database();
var input_name = process.argv[2];
var Set = require('collections/set');
var async = require('async');
var fs = require('fs');

var total_time_counter = 0;
var current_name = -1;

function crawler_by_name(input_name){
	var artist_set = new Set();
	var artist_array = [];
	var release_set = new Set();
	var release_array = [];
	var params = {
		type: "release",
		per_page: "100",
		page: "1",
		artist: ""
	};
	params['artist'] = input_name;
	var page_number = 1;
	var current_page = 0;//Indicates the current page we are searching on
	var exit_flag = 0;
	var release_number;
	var current_release = 0;
	var artist_number;
	var current_artist = 0;
	var counter = 0;
	var total_release;
	async.series({
		'init': function(callback){
			console.log('--------init-------');
			console.log(params);
			db.search(input_name, params, function(err, data){
				console.log(data.pagination);
				page_number = data.pagination.pages;
				total_release = data.pagination.items;
				console.log(page_number);
				callback(null, 'init');
			});
		},
		'search': function(callback){
			console.log('-------search on :'+ input_name + '---------');
			var current_page = 0;
			var counter = 0;
			async.whilst(
				function () { 
					console.log(counter);
					return current_page < page_number;
				},
				function (callback){
					current_page++;
					//console.log(current_page);
					setTimeout(function(){
						params['page'] = "" + current_page;
						db.search(input_name, params, function(err, data){
							if (data == undefined){
							}
							else
							if (data.results != undefined){
								for (var i = 0; i < data.results.length; i++){
									release_set.add(data.results[i].id);
									counter++;
								}
								callback(null, counter);
							}
						});
					}, 321);
				},
				function (err, counter){
					console.log('Totally '+counter+' items has been scaned');
					callback(null, 'search');
				}
			);
		},
		'release': function(callback){
			console.log('-------release of '+ input_name +'------');
			release_array = release_set.toArray();
			release_number = release_array.length;
			console.log(release_number + ' releases have been found');
			var current_release = -1;
			async.whilst(
				function() { return current_release + 1 < release_number;},
				function (callback) {
					current_release++;
					setTimeout(function(){
						var item = current_release;
						db.release(release_array[item], function(err, data){
							if (data == undefined){
							} else if (data.message == undefined){
								console.log('Receive release id = '+data.id+', '+(item+1)+'/'+release_number);
								var JSONdata = JSON.stringify(data);
								var output = JSONdata + ',\n';
								for (var i = 0; i < data.artists.length; i++)
									artist_set.add(data.artists[i].id);
								fs.appendFileSync('../jsonData/myData_release.json', output);
								callback(null, current_release);
							}
						});
					}, 321);
				},
				function (err, current_release){
					console.log('Totally '+ (current_release + 1) + ' releases have been stored');
					artist_array = artist_set.toArray();
					callback(null, 'release');
				}
			);
		},
		'artist': function(_callback){
			console.log('--------artist: ' + input_name + '--------');
			artist_number = artist_array.length;
			console.log(artist_number+' artits have been found');
			var current_artist = 0;
			var artist_timeout = setInterval(function(){		
				var item = current_artist;
						db.artist(artist_array[item], function(err, data){
							if (data == undefined){
							}
							else if (data.message == undefined){
								console.log('Receive artist id ='+data.id+', '+ (item + 1) +'/'+artist_number);
								var JSONdata = JSON.stringify(data);
								var output = JSONdata + '.\n';
								fs.appendFileSync('../jsonData/myData_artist.json', output);
							}
						});
						current_artist++;
						if (current_artist >= artist_number){
							console.log();
							clearInterval(artist_timeout);
							_callback(null, current_artist);
						}
			}, 321);
	},
	function(err, result){
		if (err) {
			console.log(err);
		}
	}
	});//async
}//function crawler_by_name();

exports.crawler_by_name = crawler_by_name;


