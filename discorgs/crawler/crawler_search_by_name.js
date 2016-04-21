var Discogs = require('disconnect').Client;
var db = new Discogs({userToken: 'UTmffTrAysekfTDiZXhTlSshcnkEiXHgmuisWyvv'}).database();

//Atucally we can search all the relavant release by the artist's name
//Once we have the release id, there would contains related artist's id
//Then we can use this artist's id to find who owns the album(aka release)

var params = {
	//the idea is using a artist name to search a list of releases
	//and then use the artist_id contained in the release data to 
	//find the related artist
	type: "release",
	per_page: "100",
	page: "1",
	//create a key for the artist
	artist: ""
};
var option = process.argv;
var name = '';
var Set = require('collections/set');
var release_set = new Set();
(function(){
	if (option.length > 2){
		//get name from the argv, later from a namelist.txt
		//the namelist.txt contains one name a line
		name = option[2];
		//in case the artist name contains several parts
		for (var i = 3; i < option.length; i++)
			name = name + ' '+ option[i];
	} else {
		return ;
	}

	params['artist'] = name;
	db.search(name, params, function(err, data){
		var pages = data.pagination.pages;
		console.log(data.pagination.items);
		var obj = params;
		//The returned data has several pages
		//that should be scaned one by one
		for (var i = 1; i <= pages; i++){
			obj["page"] = "" + i;
			//console.log(obj);
			//For each specified page, call the search function again
			db.search(name, obj, function(err, data){
				if (err) {
					console.log(err);
				} else {
					for (var i = 0; i < data.results.length; i++){
						console.log(data.results[i].id);
						release_set.add(data.results[i].id);
					}
				}
				var release_array = release_set.toArray();
//				console.log(release_array.length);
			});
		}
	});
})();
