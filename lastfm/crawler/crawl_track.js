var name = require("../../names");
var fmapi = require("./lastfm");
var utils = require("./utils");
var db = require("./database");
var crawler = require("./core");
var Promise = require("./promise");

var interval = 1000 / 4;

var crawlTrack = function(_) {
	_ = utils._.defaults(_, {limit: 100, offset: 0});
	db.Album.getTrackRelations(_, function(res, error) {
		var tracks = res.rows;
		var requests = [];
		utils._.each(tracks, function(track, index) {
			requests.push(new Promise(function(r, e){
					setTimeout(function(){
						crawler.Track.detail({artist: track.artist,
							name: track.track});
						r();
					}, interval * index);
				}));
		});
		console.log('lastfm track' + _.offset);
		_.offset += tracks.length;
		Promise.all(requests).then(
			function() {crawlTrack(_);},
			function() {crawlTrack(_);}
		);
	});
}

var offset = (parseInt(process.env.OFFSET)) || 0;

crawlTrack({offset: offset});