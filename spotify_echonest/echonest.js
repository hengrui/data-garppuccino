var request = require('request');

var api_key = '321TNQT0THCHHYBEO';
var url = 'http://developer.echonest.com/api/v4'

var _ = module.exports = {};

_.Request = function (params, callBack) {
	params.api_key = api_key;
	params.format = 'json';
	request({uri: "", baseUrl: url, qs: params, json:true},
		function(err, result, body) {
		if (err) {		
			console.error(err);
		}
		callBack && callBack(body, err);
	});
};
