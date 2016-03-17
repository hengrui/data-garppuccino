var name = require("./names.js");
var fmapi = require("./lastfm");
var utils = require("./utils");
var db = require("./database");
var crawler = require("./core");

var data = new name.Data();

// start request every second interval
var interval = 100;
var interval_handle;
// start with 1 to omit the title
var findex = 1000;
var lindex = 1;

	
var tasks = new utils.PriorityQueue({comparator: function(a, b){
	return a.priority - b.priority;
}});

// define priorities of retrieving order
// current: get artists->get albums->get tracks
var priorities = {
	artist: 1,
	albums: 2,
	tracks: 3
}

var d = 0, limit = 10;

var ntr = 3000;
var crawlTrack = function() {
	db.Album.getTrackRelations({limit: 100, offset: ntr}, function(res, error) {
		var tracks = res.rows;
		//console.log(tracks);
		utils._.each(tracks, function(track) {
			crawler.Track.detail({artist: track.artist,
				name: track.track});
		});
		ntr += tracks.length;
		crawlTrack();
	});
}

var mainCrawl = function() {
	if (!tasks.empty()) {
		t = tasks.dequeue();
		t.fun();
	}
	else if (findex < data.firstnames.length) {
		if (d > limit)
			return ;
		++d;

		var name = data.firstnames[findex][0];
		console.log("-> crawl: " + name);
		++findex;

		crawler.Artist.search({name: name},
			function(artists, n) {
			artists && 
			tasks.push({priority: 1, fun: function() {
			utils._.each(artists, function(artist) {
				// crawl album of artist
				crawler.Artist.albums(artist, function(albums, n){
						utils._.each(albums, function(album) {
							// tasks.push({priority: 2, fun: function() {
								crawler.Album.detail(album, function(album, tracks) {
									// utils._.each(tracks, function(track) {
									// 	crawler.Track.detail({artist: track.artist,
									// 		name: track.track});
									// });
								});								
							// }});
							//retrieve detail of album
						});
						n && tasks.push({priority: 1, fun: n});
					});
					crawler.Artist.detail(artist);
				});
			--d;
			}});
			//n && tasks.push({priority: 0, fun: n});
		});
	}
	else
	  interval_handle && clearInterval(interval_handle);	
}

// Main entry for crawling, callback every interval
var crawl = function(){
	crawlTrack();
	//mainCrawl();
	// return true;
}

function launch() {
	crawl();
	//interval_handle = setInterval(crawl, interval);	
}

launch();

