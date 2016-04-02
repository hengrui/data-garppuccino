var request = require('request');

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
	request({baseUrl: baseUrl, uri: params.uri, qs: params.data},
		function(err, result, body){
			if (err) {		
				console.error(err);
			}
			call && call(body, err);
	});
}

// params
// limit
// offset
// q for name
_.SearchArtist = function(params, call){
	params.type = 'artist';
	var obj = {uri: '/search', data: params};
	_.Request(obj, call);
}

