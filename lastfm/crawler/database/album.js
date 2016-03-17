var db = require("./db.js");
var squel = require("../squel");
var util = require("underscore");

var Album = module.exports = {};

Album.attributes =
	{
	"id":[],
	"name":[],
	"listeners":[db.Int],
	"playcount":[db.Int],
	"tags":[db.Json],
	"raw":[db.Json],
	"artist_id": [],
	"artist_name": [],
	}

Album.value = function(obj){
	return db.value(obj, Album.attributes);
}

var table = "lastfm_album";

Album.insert = function(params, c){
	var q = squel.insert();
	var values = [].concat(params.values);
	var fields = util._.keys(values[0]);
	q.into(table)
	    .fromQuery(fields, 
	        	squel.select().from(
	        		squel.values().setFieldsRows(values),
	        		"v(" + fields.join(",") + ")")
	        	.where("not exists ?", squel.select().from(table, 'y'
	        		).where("y.name = v.name AND y.artist_name = v.artist_name"))
	        )
        .returning("*");
    db.query(q.toString(), c);
};

Album.update = function(params, c){
	var q = squel.update().table(table);

	for (var k in (params.values || {})) {
		q.set(k, params.values[k]);
	}

	for (var k in (params.where || {})) {
		q.where(k + " = ?", params.where[k]);
	}
	db.query(q.toString(), c);
}

//offset
//limit
Album.get = function(params, c){
	var q = squel.select();
    q.from(table);
    params.offset && q.offset(params.offset);
    params.limit && q.offset(params.limit);

    for (var k in (params.where || [])) {
		q.where(k + " = ?", params.where[k]);
	}
    db.query(q.toString(), c);
}

Album.insertTrackRelations = function(params, c){
	var table = "lastfm_album_tracks";
	var q = squel.insert();
	var values = [].concat(params.values);
	var fields = util._.keys(values[0]);
    q.into(table)
	    .fromQuery(fields, 
	        	squel.select().from(
	        		squel.values().setFieldsRows(values),
	        		"v(" + fields.join(",") + ")")
	        	.where("not exists ?", squel.select().from(table, 'y'
	        		).where("y.album = v.album AND y.artist = v.artist AND y.track = v.track"))
	        )
        .returning("*");
    db.query(q.toString(), c);
}

Album.getTrackRelations = function(params, c){
		var table = "lastfm_album_tracks";
	  var q = squel.select();
    q.from(table);
    params.offset && q.offset(params.offset);
    params.limit && q.offset(params.limit);

    for (var k in (params.where || [])) {
			q.where(k + " = ?", params.where[k]);
		}
    db.query(q.toString(), c);
}