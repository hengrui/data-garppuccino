var Promise = require('../promise');
var request = require('request');
var utils = require('../utils');
var baseUrl = 'http://developer.echonest.com/api/v4/';
var api_key = '321TNQT0THCHHYBEO';

var _ = module.exports = {};

var _params = {api_key: api_key,
	bucket: ['biographies', 'blogs', 'discovery', 'discovery_rank',
	'doc_counts', 'familiarity', 'familiarity_rank', 'genre', 'hotttnesss',
	'hotttnesss_rank', 'images', 'artist_location', 'news', 'reviews',
	'songs', 'terms', 'urls', 'video', 'years_active'],
}

// params as follow
// uri: '' string
// data: object/query parameters to pass
_.Request = function(params) {
	// putting api key and else parameters defined in _params
	utils._.defaults(params.data, _params);

	// Promise allows simplier syntax using then and
	// catch rather than nested callbacks
	return new Promise(function(resolve, reject) {
		request({baseUrl: baseUrl, uri: params.uri, qs: params.data, qsStringifyOptions: {arrayFormat: 'repeat'}},
			function(err, result, body){
				if (err) {
					console.error(err);
					reject(err);
				}
				else
				{
					resolve(body);
				}
		});
		// End Promise
	});
}

//http://developer.echonest.com/docs/v4/artist.html#profile
// Params
//  need artist_uri
_.ArtistProfile = function(params){
	var obj = {
		uri: 'artist/profile', data: {id: params.artist_uri}};
	return _.Request(obj);
}

//http://developer.echonest.com/docs/v4/track.html#profile
//http://developer.echonest.com/docs/v4/song.html#profile
_.SearchTrack = function(params, call){
	//id = spotify:track:5ChkMS8OtdzJeqyybCc9R5
	var obj = {
		tracks: {uri: '/track/profile', bucket: 'audio_summary', id: track.uri},
		songs: {uri: '/song/profile', track_id: track.uri,
		bucket: ['audio_summary', 'artist_discovery', 'artist_discovery_rank', 'artist_familiarity', 'artist_familiarity_rank', 'artist_hotttnesss', 'artist_hotttnesss_rank', 'artist_location', 'song_currency', 'song_currency_rank', 'song_hotttnesss',
		'song_hotttnesss_rank', 'song_type', 'tracks']}
	}
}

//no album API for echonest
