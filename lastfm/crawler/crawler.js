var name = require("../../names");
var fmapi = require("./lastfm");
var utils = require("./utils");
var db = require("./database");
var crawler = require("./core");
var promise = require("./promise");

var limit = 100;
var findex = 7;
var lindex = 1;
var timeout = 100;
var crawlTrack = function(_) {
	_ = utils._.defaults(_, {limit: 100, offset: 0});
	db.Album.getTrackRelations(_,
		function(res, error) {
		var tracks = res.rows;
		//console.log(tracks);
		utils._.each(tracks, function(track) {
			crawler.Track.detail({artist: track.artist,
				name: track.track});
		});
		_.offset += tracks.length;
		if (tracks.length == _.limit) {
			crawlTrack(_);		
		} else {
			setTimeout(crawlTrack, 1000);
		}
		//console.log('crawlTrack: ' + ntr);
	});
}

var nal = 2482;
var crawlAlbum = function() {
	db.Artist.get({limit: limit, offset: nal}, function(res, error) {
		var artists = res.rows;
		utils._.each(artists, function(artist) {
			crawler.Artist.albums(artist, function(albums, n){
						utils._.each(albums, function(album) {
								crawler.Album.detail(album, function(album, tracks) {
								});
						});
						n && n();
					});
			crawler.Artist.detail(artist);
		});
		nal += artists.length;
		if (artists.length == limit) {
			crawlAlbum();		
		} else {
			setTimeout(crawlAlbum, 1000);
		}
	});
}

var crawlArtist = function(_){
	_ = utils._.defaults(_, {index: 0, limit:50, offset:0});
	var index = _.index;
	if (index < data.firstnames.length) {
		var name = data.firstnames[index][0];
		crawler.Artist.search({name: name, limit:1000}, function(artists, n) {
			if (!n) {			
				++_.index;
				crawlArtist(_);
			}
			n && n();
		});
	} else {
		console.log('Artist crawl finished ' + findex);
	}
}

var report = function(){
	console.log('Artist ' + findex + '; Album ' + nal + '; Track' + ntr + '; Requests:' + fmapi.requestCount);
}

var crawl = function(){
	crawlArtist();
	crawlTrack();
	crawlAlbum();
	//setInterval(report, 1000);
}

//retrieve names and callback upon completion
var data = new name.Data(crawl);
