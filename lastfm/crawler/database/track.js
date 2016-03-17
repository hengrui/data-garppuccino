var db = require("./db.js");
var squel = require("../squel");
var util = require("underscore");

var Track = module.exports = {};

Track.attributes =
	{
	"name":[],
	"id":[],
	"listeners":[db.Int],
	"playcount":[db.Int],
    "duration":[db.Int],
	"tags":[db.Json],
	"raw":[db.Json],
	"artist_id":[],
	"artist_name":[],
	}

Track.value = function(obj){
	return db.value(obj, Track.attributes);
}

var table = "lastfm_track";

Track.insert = function(params, c){
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

Track.update = function(params, c){
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
Track.get = function(params, c){
	var q = squel.select();
    q.from(table);
    params.offset && q.offset(params.offset);
    params.limit && q.offset(params.limit);

    for (var k in (params.where || {})) {
		q.where(k + " = ?", params.where[k]);
	}
    db.query(q.toString(), c);
}