var name = require("../../names");
var fmapi = require("./lastfm");
var utils = require("./utils");
var db = require("./database");
var crawler = require("./core");

var limit = 100;

var findex = 7;
var lindex = 1;
var ntr = 4279;
var crawlTrack = function() {
	db.Album.getTrackRelations({limit: limit, offset: ntr},
		function(res, error) {
		var tracks = res.rows;
		//console.log(tracks);
		utils._.each(tracks, function(track) {
			crawler.Track.detail({artist: track.artist,
				name: track.track});
		});
		ntr += tracks.length;
		if (tracks.length == limit) {
			crawlTrack();		
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

var crawlArtist = function(){
	if (findex < data.firstnames.length) {
		var name = data.firstnames[findex][0];
		crawler.Artist.search({name: name, limit:1000}, function(artists, n) {
			console.log('crawlArtist: ' + findex);
			if (!n) {			
				++findex;
				crawlArtist();
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
	setInterval(report, 1000);
}

//retrieve names and callback upon completion
var data = new name.Data(crawl);
