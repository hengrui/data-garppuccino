var squel = require("squel").useFlavour('postgres');
var _ = require("underscore");

// squel.registerValueHandler(Object, function(object) {
//   return '"' + JSON.stringify(object) + '"';
// });

squel.cls.DefaultQueryBuilderOptions.replaceSingleQuotes = true;

squel.cls.InsertFieldValueBlock.prototype.values_only_ = function(){
  this.values_only = true;
}

squel.cls.InsertFieldValueBlock.prototype.buildStr = function(queryBuilder){
    var str = "";
    if (0 >= this.fields.length) {
          return '';
    }
    if (!this.values_only)
    str = "(" + (this.fields.join(', ')) + ") ";
    return str + "VALUES (" + (this._buildVals().join('), (')) + ")";
};

squel.values = function(options) {
	var cls = squel.cls;
	var _extend = _.extend;

	return squel.select(options,
	  	[
          new cls.InsertFieldValueBlock(_extend({}, options, {allowNested:true}))
    	]).values_only_();
};
module.exports = squel;
