// handles connection, to use by other staffs

var pg = require('pg');

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
