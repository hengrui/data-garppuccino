var name = require("./names.js");
var fmapi = require("./lastfm.js");

var data = new name.Data();

// start request every second interval
var interval = 400;

// start with 1 to omit the title
var findex = 1;
var lindex = 1;

var crawl = function(){
	if (findex < data.firstnames.length) {
		var name = data.firstnames[findex][0];
		console.log(name);
		fmapi.SearchArtist({name: name},
			function(result, err) {
				if (!err){
					var artists = result
						.results.artistmatches.artist;
					console.log(artists);
				}
			});
		++findex;
	}
}

crawl();
var interval_handle = setInterval(crawl, interval);