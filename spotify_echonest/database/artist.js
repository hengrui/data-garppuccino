var squel = require("./squel");
var db = require("./db.js");
var utils = require("../utils");

// c a function call back{
//  result
//  err (if any err encountered)
// }
var _ = module.exports = {}

// params {
// values
// }
_.table = 'spotify_artist';

_.insert = function(params, c){
	var values = [];
	var q = squel.insert().into(_.table);

	// convert to table format
	for (var i = 0; i < params.values.length; ++i) {
		var value = params.values[i];
		var obj = utils._.extend({},
			{raw: JSON.stringify(value)},
			{id: value.id, name: value.name, popularity: value.popularity}
			);
		values.push(obj);
	}

	var fields = utils._.keys(values[0]);
  q.into(_.table)
      .fromQuery(fields, 
      	squel.select().from(
      		squel.values().setFieldsRows(values),
      		"v(" + fields.join(",") + ")")
      	.where("v.name not in ?",
      		squel.select().field('g.name').from(_.table, 'g'))
      )
  .returning("*");

	db.query(q.toString(), c);
}

// params {
// limit
// offset
// where #not implemented yet
// }
// to get artists, access to result.rows then iterate through
// item.id
_.get = function(params, c) {
	var q = squel.select().from(_.table);
	params.limit && q.limit(params.limit);
	params.offset && q.offset(params.offset);

	for (var k in params.where) {
		q.where(k + " = ?", params.where[k]);
	}
	q.order('update_on');
	db.query(q.toString(), c);
}