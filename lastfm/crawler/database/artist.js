var db = require("./db.js");
var squel = require("squel");
var util = require("underscore");

var Artist = module.exports = {};

Artist.attributes =
	[
	"id" ,
	"name",
	"lastname",
	"firstname" ,
	"listeners" ,
	"playcount" ,
	"bio" ,
	"tags"
	]

Artist.value = function(obj){
	return util.pick(obj, Artist.attributes);
}

var table = "lastfm_artist";

Artist.insert = function(params, c){
	var q = squel.insert();
    q.into(table)
        .setFieldsRows([].concat(params.values));

    db.query(q.toString(), c);
};

//offset
//limit
Artist.get = function(params, c){
	var q = squel.select();
    q.from(table);
    params.offset && q.offset(params.offset);
    params.limit && q.offset(params.limit);

    for (var k in (params.where || [])) {
		q.where(k + " = ?", params.where[k]);
	}
    db.query(q.toString(), c);
}