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
        	.where("v.name not in ?", squel.select().field('name').from(table))
        )
        .returning("*");
    // console.log(quel.values().setFieldsRows(values).toString());
    // console.log(q.toString());
    db.query(q.toString(), c);

};

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