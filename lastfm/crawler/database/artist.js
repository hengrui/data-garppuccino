var db = require("./db.js");
var squel = require("../squel");
var util = require("underscore");

var Artist = module.exports = {};

var attributes = Artist.attributes =
	{
	"id":[] ,
	"name":[],
	"lastname":[],
	"firstname":[],
	"listeners":[db.Int],
	"playcount":[db.Int],
	"bio" : [db.Json],
	"tags": [db.Json],
	"raw" : [db.Json]
	}

Artist.value = function(obj){
	return db.value(obj, attributes);
}

var table = Artist.table = "lastfm_artist";

Artist.insert = function(params, c){
	var q = squel.insert();
	var values = [].concat(params.values);
	var fields = util._.keys(values[0]);
    q.into(table)
        .fromQuery(fields, 
        	squel.select().from(
        		squel.values().setFieldsRows(values),
        		"v(" + fields.join(",") + ")")
        	.where("v.name not in ?", squel.select().field('g.name').from(table, 'g'))
        )
        .returning("*");

    db.query(q.toString(), c);
};

//offset
//limit
Artist.get = function(params, c){
	var q = squel.select();
    q.from(table);
    params.offset && q.offset(params.offset);
    params.limit && q.limit(params.limit);

    for (var k in (params.where || [])) {
		q.where(k + " = ?", params.where[k]);
	}
    db.query(q.toString(), c);
}

Artist.update = function(params, c){
	var q = squel.update().table(table);

	for (var k in (params.values || {})) {
		q.set(k, params.values[k]);
	}

	for (var k in (params.where || {})) {
		q.where(k + " = ?", params.where[k]);
	}
	db.query(q.toString(), c);
}