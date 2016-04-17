var api = require('./api');
var names = require('../names');
var db = require('./database');
var utils = require('./utils');
var Promise = require('./promise');

var main = function(){
	//once names readed, this function gets called;
	spotifyArtist({limit:50, offset:0});
}

var echoArtist = function(artist) {
	return api.echonest.ArtistProfile({artist_uri: artist.raw.uri})
	.then(function(r) {
		db.echonest.Artist.insert(
			{values: {id: artist.id, raw: r}})
		.then(function(r) {
			console.log(r.row.length > 0 ? 'saved' : 'ignored');}
		)
		;
		// the above then can be commented or leave for else
	});
}

var interval = 60 * 1000 / 19;
// 19 requests per minute?

var spotifyArtist = function(_){
	_ = utils._.defaults(_, {index: 0, array:[], limit:50, offset: 0});
	db.Artist.get(_)
	.then(function(result) {
		_.array = result.rows;
		_.index = 0;
		for (var i = 0; i < _.array.length; ++i) {
			_.array[i].raw = JSON.parse(_.array[i].raw);
			//console.log(_.array[i].raw.uri);
		}
		return _.array;
	}).then(function(artists){
		var requests = [];
		for (var i = 0; i < _.array.length; ++i) {
			requests[i] = (function(i) {
				var artist = _.array[i];
				return new Promise(function(r, e) {
				setTimeout(function() {
					console.log(artist);
					r(echoArtist(artist));
				}, interval * i);
			})})(i);
		}
		return Promise.all(requests);
	})
	.then(function() {
		//console.log('finished');
		// _.offset += _.array.length;
		spotifyArtist(_);
	});
}

main();