//entry point for search

var api = require('./api');
var names = require('../names');
var db = require('./database');
var utils = require('./utils');

var main = function(){
	//once names readed, this function gets called;
	//crawlArtist();
	crawlArtistAlbums({offset:0});
	//crawlAlbumTracks({limit: 50, offset: 0});
}

var crawlAlbum = function(_, c) {
	api.spotify.SearchArtistAlbums(
		utils._.extend(_, {album_type: 'album'})).then(
		function(response){
			response = JSON.parse(response);
			var albums = response['items'];
			if (albums.length > 0)
				db.Album.insert({values: albums, artist_id: _.artist_id});
			if (albums.length < _.limit) {
				c && c(); //inform that this artist is finished
			} else {
				_.offset += _.limit;
				crawlAlbum(_, c);
			}
	});
}

var crawlArtistAlbums = function(_){
	_ = utils._.defaults(_, {index: 0, array:[], limit:50, offset: 0});
	if (_.index >= _.array.length) {
		_.offset += _.array.length;
		db.Artist.get(_)
		.then(function(result) {
			_.array = result.rows;
			_.index = 0;
			for (var i = 0; i < _.array.length; ++i) {
				_.array[i].raw = JSON.parse(_.array[i].raw);
			}
			return _;
		}).then(crawlArtistAlbums);	
	} else {
		//do staff with one artist in database
		var artist = _.array[_.index];

		crawlAlbum({
			limit: 50,
			offset: 0,
			artist_id: artist.id
		}, function(undefined_album_finished){
			//then api call back
			++_.index;
			crawlArtistAlbums(_);
		});
	}
}

main();
