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
    q.into(table)
        .setFieldsRows([].concat(params.values));

    db.query(q.toString(), c);
};

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