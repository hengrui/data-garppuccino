var _ = module.exports = {
	db: require("./db.js"),
	Artist: require("./artist.js"),
	Album: require("./album.js"),
	Track: require("./track.js"),
	echonest: {
		Artist : require("./ech-artist.js")
	}
}