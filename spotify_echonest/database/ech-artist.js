var squel = require("./squel");
var db = require("./db.js");
var utils = require("../utils");

var _ = module.exports = {}

_.table = 'echonest_artist';

_.insert = function(params){
	var values = [].concat(params.values);
	var q = squel.insert().into(_.table);

	// convert to table format
	var fields = utils._.keys(values[0]);
  q.into(_.table)
      .fromQuery(fields, 
      	squel.select().from(
      		squel.values().setFieldsRows(values),
      		"v(" + fields.join(",") + ")")
      	.where("v.id not in ?",
      		squel.select().field('g.id').from(_.table, 'g'))
      )
  .returning("*");

	return db.query(q.toString());
}