// handles connection, to use by other staffs

var pg = require('pg');
var utils = require('../utils');

//Unfortunately i have only time to do this much yet
//Future improvement
var config = {
            user: "user",
            password: "bigdatahkust",
            database: "bigdata",
            port: 5432,
            host: "164.132.194.29",
            ssl: true
        };

var _ = module.exports = {};

_.query = function(queryStr, resultCallBack) {
	pg.connect(config, function(err, client, done) {
        client.query(queryStr, function(err, result) {
			if (err) {
				console.error(JSON.stringify({query: queryStr, error: err}));
			}
          done();          
	      resultCallBack && resultCallBack(result, err);
        })
  });
}

_.Int = function(val) {
    if (typeof val === 'string' && val != null) {
        return parseInt(val);
    }
    return val;
}

_.Json = function(val) {
    if (typeof val !== 'string' && val != null) {
        return JSON.stringify(val);
    }
    return val;
}

_.value = function(obj, attributes) {
    var rt = {};
    for (var k in attributes) {
        if (obj[k] == null)
            continue;
        rt[k] = obj[k];
        utils._.each(attributes[k], function(r) {
            rt[k] = r(rt[k]);
        })
    }
    return rt;
}