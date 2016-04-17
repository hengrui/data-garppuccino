var request = require('request');
var Promise = require('../promise');

var baseUrl = 'https://api.spotify.com/v1';

var params = {q: 'laddy',
            type: 'artist',
            limit: 50,
            offset: 0}

var _ = module.exports = {};

// params as follow
// uri: '' string
// data: object/query parameters to pass
_.Request = function(params, call) {
	// Promise allows simplier syntax using then and
	// catch rather than nested callbacks
	return new Promise(function(resolve, reject) {
		request({baseUrl: baseUrl, uri: params.uri, qs: params.data},
			function(err, result, body){
				if (err) {		
					reject(err);
					console.error(err);
				} else
				resolve(body);
		})
	});
}

// params {
// limit
// offset
// q for name
// }
_.SearchArtist = function(params){
	params.type = 'artist';
	var obj = {uri: '/search', data: params};
	return _.Request(obj);
}

// params {
// limit
// offset
// artist_id for artist
// }
_.SearchArtistAlbums = function(params){
	params.type = 'album';
	var obj = {uri:'/artists/'+ params.artist_id + '/albums', data:params};
	return _.Request(obj);
}
