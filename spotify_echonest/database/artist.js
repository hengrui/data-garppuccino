var squel = require("./squel");
var db = require("./db.js");
var utils = require("../utils");

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
