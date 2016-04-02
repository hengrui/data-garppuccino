//entry point for search

var api = require('./api');
var names = require('../names');

var findex = 1;
var crawlArtist = function(){
	if (findex < data.firstnames.length) {
		var fname = data.firstnames[findex][0];
		api.spotify.SearchArtist({q: fname}, function(response, err){
			console.log(response);
			++findex;
			crawlArtist();
		});
	}
}

var data = new names.Data(
	function(){
		//once names readed, this function gets called;

	crawlArtist();
});
