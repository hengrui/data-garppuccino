//entry point for search

var api = require('./api');
var names = require('../names');
var db = require('./database');
var utils = require('./utils');
var Promise = require('./promise');
var interval = 60 * 1000 / 40;

var main = function(){
	//once names readed, this function gets called;
	//crawlArtist();
	crawlArtistAlbums({offset:0});
	//crawlAlbumTracks({limit: 50, offset: 0});
}

var crawlAlbum = function(_) {
	_ = utils._.defaults(_, {limit: 50, offset:0, album_type: 'album'});
	var p = api.spotify.SearchArtistAlbums(_);
	p = p.then(function(response){
				//console.log(response);
				response = JSON.parse(response);
				var albums = response['items'];
				albums || console.log(response);
				if (albums && albums.length > 0)
					db.Album.insert({values: albums, artist_id: _.artist_id});
				if (albums && albums.length < _.limit) {
					//c && c(); //inform that this artist is finished
				} else {
					_.offset += _.limit;
					//crawlAlbum(_, c);
				}
				return 0;
		});
	return p;
}

var crawlArtistAlbums = function(_){
	_ = utils._.defaults(_, {index: 0, array:[], limit:50, offset: 0});
	db.Artist.get(_)
	.then(function(result) {
		_.array = result.rows;
		_.index = 0;
		// for (var i = 0; i < _.array.length; ++i) {
		// 	_.array[i].raw = JSON.parse(_.array[i].raw);
		// }
		//console.log(_.array);
		return _.array;
	})
	.then(function(artists) {
		var requests = [];
		for (var i = 0; i < artists.length; ++i) {
			requests[i] = (function(i) {
				var artist = artists[i];
				return new Promise(function(r, e) {
					setTimeout(function() {
						r(crawlAlbum({artist_id: artist.id}));
					}, interval * i);
				});
			})(i);
		}
		return Promise.all(requests);
	})
	.then(function() {
		_.offset += _.array.length;
		crawlArtistAlbums(_);
	});
}

main();
