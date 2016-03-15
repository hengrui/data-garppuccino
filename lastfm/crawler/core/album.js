var fmapi = require("../lastfm");
var utils = require("../utils");
var db = require("../database");

var Album = module.exports = {};

Album.detail = function(param, c) {
	fmapi.GetAlbumInfo({artist: param.artist, id:param.id, album: param.name},
		function(result, err) {
			if (!err && result.artist){
				var artist = result.artist;
				artist.id = artist.mbid;
				var obj = db.Artist.value(artist);
				db.Album.update({
					where: {name:param.name, artist_name:param.artist},
					values: obj
				});
				callBack && callBack(artist);
			}
	})
}
