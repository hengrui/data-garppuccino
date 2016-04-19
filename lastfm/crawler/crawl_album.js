var name = require("../../names");
var fmapi = require("./lastfm");
var utils = require("./utils");
var db = require("./database");
var crawler = require("./core");
var Promise = require("./promise");

var interval = 1000 / 4;

var crawlAlbum = function(_) {
	_ = utils._.defaults(_, {limit: 100, offset:0});
	db.Album.get(_, function(res, error) {
		var albums = res.rows;
		var requests = [];
		utils._.each(albums, function(album, index) {
			requests.push(new Promise(function(r, e){
					setTimeout(function(){
						crawler.Album.detail(album, function(album, tracks) {
							//console.log(album);
							r();
						});
					}, interval * index);
				}));
		});
		console.log('lastfm album ' + _.offset);
		_.offset += albums.length;
		Promise.all(requests).then(
			function() {crawlAlbum(_);},
			function() {crawlAlbum(_);}
		);
	});
}

var offset = (process.env.OFFSET) || 0;

crawlAlbum({offset: offset});