var fmapi = require("../lastfm");
var utils = require("../utils");
var db = require("../database");

var Album = module.exports = {};

Album.detail = function(param, c) {
	fmapi.GetAlbumInfo({artist: param.artist,
		id:param.id, album: param.name},
		function(result, err) {
			if (!err && result.album){
				var album = result.album;
				album.id = album.mbid;
				var obj = db.Album.value(album);
				db.Album.update({
					where: {name:album.name,
						artist_name:album.artist},
					values: obj
				}, function() {
					var conv = [];
					utils._.each(album.tracks.track, function(track) {
						conv.push({
							artist: album.artist,
							track: track.name, album: album.name
						});
					});
					if (conv.length > 0) {
						db.Album.insertTrackRelations({values: conv}, function(res, err) {
							err && console.log(err);
							!err && c && c(album, res.rows);
						});						
					}
				});
			}
	})
}
