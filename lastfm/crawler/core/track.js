var fmapi = require("../lastfm");
var utils = require("../utils");
var db = require("../database");

var Track = module.exports = {};

Track.detail = function(param, c) {
	fmapi.GetTrackInfo({artist: param.artist,
		id:param.id, track: param.name},
		function(result, err) {
			if (!err && result.track){
				var track = result.track;
				track.id = track.mbid;
				track.artist_name = track.artist.name;
				track.artist_id = track.artist.mbid || '';
				track.tags = track.toptags.tag || [];		
				var obj = db.Track.value(track);
				db.Track.insert({
					where: {name:param.name,
						artist_name:param.artist},
					values: obj
				});
				c && c(track);
			}
	})
}
