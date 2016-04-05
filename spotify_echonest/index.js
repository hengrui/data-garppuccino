//entry point for search

var api = require('./api');
var names = require('../names');
var db = require('./database');

var _ = {index: 5, limit: 10, offset:0};
var crawlArtist = function(){
	if (_.index < data.firstnames.length) {
		var fname = data.firstnames[_.index][0];
		api.spotify.SearchArtist({q: fname, limit:_.limit, offset: _.offset},
			function(response, err){
			response = JSON.parse(response);
			var artists = response['artists']['items'];
			//console.log(artists);
			db.Artist.insert({values: artists});
			if (artists.length < _.limit) {
				++_.index;
				_.offset = 0;
				crawlArtist();				
			} else {
				_.offset += _.limit;
				crawlArtist();
			}

		});
	}
}

var _artists = {idx: 0, array: [], limit:50, offset: 0};
var getArtists = function(){
	var _ = _artists;
	if (_.idx >= _.array.length) {
		_.offset += _.array.length;
		console.log(_.offset);
		db.Artist.get(_artists, function(result, err) {
			if (!err) {
				_.array = result.rows;
				_.idx = 0;
				getArtists();
			}
		});		
	} else {
		//do staff with one artist in database
		var artist = _.array[_.idx];
		console.log(artist);

		//then api call back
		++_.idx;
		getArtists();
	}
}

var data = new names.Data(
	function(){
		//once names readed, this function gets called;
	crawlArtist();
	getArtists();
});
