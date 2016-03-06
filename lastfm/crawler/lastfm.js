var request = require('request');
var underscore = require('underscore');
// some utils in underscore are great

var _ = module.exports = {};

var api_key = process.env.API_KEY || 'ad3f3423cdfb09e3e374c7ccf2c6c347';
var url = "http://ws.audioscrobbler.com/2.0/";

_.Request = function (params, callBack) {
	params.api_key = api_key;
	params.format = 'json';
	request({uri: "", baseUrl: url, qs: params, json:true},
		function(err, result, body) {
		if (err) {		
			console.log(err);			
		}
		callBack(body, err);
	});
};

// params: {firstname, lastname}
// page default to 1
// limit default to 30
_.SearchArtist = function(params, callBack) {
	var name = params.name || ((params.firstname || "") +
	(params.firstname && params.lastname && " ")+
	(params.lastname || ""));

	params.artist = name;
	params = underscore.pick(params, 'artist', 'page', 'limit');
	params.method = "artist.search";
	_.Request(params, callBack);
};

// params: {id: }
_.GetArtistTracks = function(params, callBack) {
	var obj = underscore.pick(params, 'page', 'limit');
	obj.mbid = params.id;
	obj.method = "artist.getTopTracks";	
	_.Request(obj, callBack);
};

// params: {id: }
_.GetArtistAlbums = function(params, callBack) {
	var obj = underscore.pick(params, 'page', 'limit');
	obj.mbid = params.id;
	obj.method = "artist.getTopAlbums";	
	_.Request(obj, callBack);
};
