//entry point for search

var api = require('./api');
var names = require('../names');
var db = require('./database');
var utils = require('./utils');

var main = function(){
	//once names readed, this function gets called;
	//crawlArtist({limit: 10});
	crawlArtistAlbums({limit:50, offset:0});
}

var crawlArtist = function(_){
	utils._.defaults(_, {index: 0, limit:50, offset:0});

	if (_.index + 1 < data.firstnames.length) { //+1 to omit the header row
		var fname = data.firstnames[_.index + 1][0];

		api.spotify.SearchArtist({q: fname, limit:_.limit, offset: _.offset})
		.then(
			function(response){
				response = JSON.parse(response);
				var artists = response['artists']['items'];
				//console.log(artists);
				db.Artist.insert({values: artists});
				if (artists.length < _.limit) {
					++_.index;
					_.offset = 0;
					crawlArtist(_);	
				} else {
					_.offset += _.limit;
					crawlArtist(_);
				}
			});

	}
}

// artist being one tuple in artist database
// _ {
// artist_id
// limit
// offset
// }
// c to inform that this search is finished
var crawlAlbum = function(_, c) {
	api.spotify.SearchArtistAlbums(
		utils._.extend(_, {album_type: 'album'})).then(
		function(response){
			response = JSON.parse(response);
			var albums = response['items'];
			if (albums.length > 0)
				db.Album.insert({values: albums, artist_id: _.artist_id});
			// for logs
			// for(var i = 0; i<albums.length; i++){
				// console.log(albums[i].id + ' - ' + albums[i].name);
			// }
			if (albums.length < _.limit) {
				c && c(); //inform that this artist is finished
			} else {
				_.offset += _.limit;
				crawlAlbum(_, c);
			}
	});
}

var echoArtist = function(artist) {
	return api.echonest.ArtistProfile({artist_uri: artist.raw.uri})
	.then(function(r) {
		db.echonest.Artist.insert(
			{values: {id: artist.id, raw: r}})
		.then(function(r) {console.log('saved');})
		;
		// the above then can be commented or leave for else
	});
}

// _ {
// limit
// }
// can later add track in callback as well
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
				//console.log(_.array[i].raw.uri);
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
		echoArtist(artist);
		//echoArtist
	}
}

var data = new names.Data(main);
