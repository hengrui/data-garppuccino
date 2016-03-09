var name = require("./names.js");
var fmapi = require("./lastfm.js");
var utils = require("./utils/utils.js");
var db = require("./database/all.js");

var data = new name.Data();

// start request every second interval
var interval = 400;

// start with 1 to omit the title
var findex = 1;
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

// Main entry for crawling, callback every interval
var crawl = function(){
	if (!tasks.empty()){
		var task = tasks.dequeue();
		//do some staff;
		console.log(task);
		if (task.artist) {
			console.log(task.artist);
			// var obj = db.Artist.value(task.artist);
			// obj.id = task.artist.mbid;
			// db.Artist.insert({values: obj}, function(res, err){
			// 	err && console.error(err);
			// });
		}

	} else {
		if (findex < data.firstnames.length) {
			var name = data.firstnames[findex][0];
			fmapi.SearchArtist({name: name},
				function(result, err) {
					if (!err){
						var artists = result
							.results.artistmatches.artist;

						var conv = [];
						utils._.each(artists, function(elem) {
							var artist = db.Artist.value(elem);
							artist.id = elem.mbid;
							conv.push(artist);
							tasks.enqueue(
								{priority: priorities.artist,
								artist: artist});
						});
						db.Artist.insert({values: conv}, function(res, err){
							err && console.error(err);
						});
					}
				});
			++findex;
		} else
		clearInterval(interval_handle);
	}
}

crawl();
var interval_handle = setInterval(crawl, interval);