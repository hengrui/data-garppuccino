var _ = module.exports = {
	db: require("./db.js"),
	Artist: require("./artist.js"),
	Album: require("./album.js"),
	echonest: {
		Artist : require("./ech-artist.js")
	}
}