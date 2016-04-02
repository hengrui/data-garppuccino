//entry point for search

var api = require('./api');
var names = require('../names');
var db = require('./database');

var _ = {index: 5, limit: 50, offset:0};
var crawlArtist = function(){
	if (_.index < data.firstnames.length) {
		var fname = data.firstnames[_.index][0];
		api.spotify.SearchArtist({q: fname, limit:_.limit, offset: _.offset},
			function(response, err){
			response = JSON.parse(response);
			var artists = response['artists']['items'];
			console.log(artists);
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

var data = new names.Data(
	function(){
		//once names readed, this function gets called;
	crawlArtist();
});
