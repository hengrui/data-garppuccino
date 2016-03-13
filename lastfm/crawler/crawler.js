var name = require("./names.js");
var fmapi = require("./lastfm");
var utils = require("./utils");
var db = require("./database");
var crawler = require("./core");

var data = new name.Data();

// start request every second interval
var interval = 400;
var interval_handle;
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
	// if (!tasks.empty()){
	// 	var task = tasks.dequeue();
	// 	//do some staff;
	// 	console.log(task);
	// 	if (task.artist) {
	// 		console.log(task.artist);
	// 		// var obj = db.Artist.value(task.artist);
	// 		// obj.id = task.artist.mbid;
	// 		// db.Artist.insert({values: obj}, function(res, err){
	// 		// 	err && console.error(err);
	// 		// });
	// 	}
	// } else 
	{
		if (findex < data.firstnames.length) {
			var name = data.firstnames[findex][0];
			
			crawler.Artist.search({name: name}, function(artists, n) {
				utils._.each(artists, function(artist) {
					crawler.Artist.tracks(artist, function(tracks, n){
						tracks[0] && console.log(tracks[0]);
						n();//get more tracks
					});
					crawler.Artist.detail(artist);
				});
				n();
			});
			++findex;
		} else
		interval_handle && clearInterval(interval_handle);
	}
}


function launch() {
	crawl();
	interval_handle = setInterval(crawl, interval);	
}

launch()

