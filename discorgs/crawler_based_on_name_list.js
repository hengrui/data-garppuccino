var Discogs = require('disconnect').Client;
var db = new Discogs({userToken: 'UTmffTrAysekfTDiZXhTlSshcnkEiXHgmuisWyvv'}).database();
var input_name = process.argv[2];
var Set = require('collections/set');
var artist_set = new Set();
var artist_array;
var release_set = new Set();
var release_array;

(function(){
	//Get the input name from the command line
	if (process.argv.length > 2){
		for (var i = 3; i < process.argv.length; i++)
			input_name = input_name + ' ' + process.argv[i];
	} else {
		return ;
	}
	var token = 'init';
				   //Token could be 'release', 'artist', 'search', 'init'
				   //Specially 'init' calls db.search() to get the total page number
				   //of the releases given the artist name, input_name 
	var params = {
		type: "release",
		per_page: "1000",
		page: "1",
		artist: ""
	};
	params['artist'] = input_name;
	console.log(params);
	var page_number = 1;
	var current_page = 0;//Indicates the current page we are searching on
	var exit_flag = 0;
	var release_number;
	var current_release = 0;
	var artist_number;
	var current_artist = 0;

	//The searching function is tooooo time consuming
	//maybe I should try to search singly and combine the rest together.
	var timeout = setInterval(function(){
		switch (token){
			case 'init':
				console.log('------init---------');
				db.search(input_name, params, function(err, data){
					if (err) {
						return ;
					} else {
						page_number = data.pagination.pages;
						//console.log(data.pagination.items);
						//console.log(page_number);
					}
					token = 'search';
				});
				break;
			case 'search':
				current_page++;
				console.log('-----search ' + current_page + '---------' + page_number);
				if (current_page > page_number){
					token = 'release';
					release_array = release_set.toArray();
					release_number = release_array.length;
				} else {
					params['page'] = "" + current_page;
					db.search(input_name, params, function(err, data){
						if (err) {
							console.log(err);
							return ;
						} else {
							for (var i = 0; i < data.results.length; i++)
								release_set.add(data.results[i].id);
						}
					});
				}
				break;
			case 'release':
				current_release++;
				console.log('-----release ' + current_release + '-----------' + release_number);
				if (current_release > release_number){
					token = 'artist';
					artist_array = artist_set.toArray();
					artist_number = artist_array.length;
				} else {
					db.release(release_array[current_release], function(err, data){
						if (err){
							console.log(err);
							return ;
						} else {
							if (data == undefined){
								console.log('No data for release id= ' + current_release);
							} else if (data.message == undefined){
								console.log('Get data of release id= ' + data.id);
								var artists = data.artists;
								for (var i = 0; i < artists.length; i++)
									artist_set.add(artists[i].id);
							} else {
								console.log('No data for release id= ' + current_release);
							}
						}
					});
				}
				break;
			case 'artist':
				current_artist++;
				console.log('--------artist '+ current_artist + ' ----------' + artist_number);
				if (current_artist > artist_number){
					console.log('Searching Completed!');
					exit_flag = 1;
				} else {
					db.artist(artist_array[current_artist], function(err, data){
						if (err) {
							console.log(err);
							return ;
						} else {
							if (data == undefined){
								console.log('No data for aritst id= ' + current_artist);
							} else if (data.message == undefined){
								console.log('Get data of artist id= ' + data.id);
							} else {
								console.log('No data for artist id= ' + current_artist);
							}
						}
					});
				}
				break;
		}
		if (exit_flag){
			clearInterval(timeout);
		}
	}, 2521);

})();


