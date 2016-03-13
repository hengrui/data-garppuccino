var fmapi = require("../lastfm");
var utils = require("../utils");
var db = require("../database");

var Artist = module.exports = {};

var search = Artist.search = function(params, callBack) {
	params = utils._.defaults(params, {page: 1});
	fmapi.SearchArtist(params,
		function(result, err) {
			if (!err && result.results){
				var totalCount = result.results["opensearch:totalResults"];
				var startIndex = result.results["opensearch:startIndex"];
				var count = result.results["opensearch:itemsPerPage"];

				var artists = result
					.results.artistmatches.artist;

				if (artists.length < 1)
					return ;

				var next = function() {
					if (count + startIndex < totalCount) {
					params.page += 1;
					search(params, callBack);
					}
				}

				var conv = [];
				utils._.each(artists, function(elem) {
					elem.id = elem.mbid;
					conv.push(db.Artist.value(elem));
				});
				db.Artist.insert({values: conv}, function(res, err){
					!err && callBack && callBack(res.rows, next);
					err && console.error(err);
				});
				callBack || next();
			}
		});
}

//param name
var detail = Artist.detail = function(param, callBack) {
	fmapi.GetArtistInfo({artist: param.name, id:param.id},
		function(result, err) {
			if (!err && result.artist){
				var artist = result.artist;
				artist.id = artist.mbid;
				var obj = db.Artist.value(artist);
				db.Artist.update({
					where: {name:artist.name},
					values: obj
				});
				callBack && callBack(artist);
			}
	})
};

var getTracks = Artist.tracks = function(param, callBack) {
	param = utils._.defaults(param, {page: 1});
	param = utils._.extend(param, {artist: param.name, id:param.id});

	fmapi.GetArtistTracks(param,
		function(result, err) {
			if (!err && result.toptracks){
				var tracks = result.toptracks.track;
				var pagecount = result.toptracks["@attr"].totalPages;

				var next = function() {
					if (param.page < pagecount) {
						param.page += 1;
						getTracks(param, callBack);
					}
				}

				if (tracks.length > 0) {
					var conv = [];
					utils._.each(tracks, function(elem){
						elem.id = elem.mbid || '';
						conv.push(db.Track.value(elem));
					});
					db.Track.insert({values: conv}, function(res, err){
						!err && callBack && callBack(res.rows, next);
						err && console.error(err);
					});
					callBack || next();
				}
			}
	})
}