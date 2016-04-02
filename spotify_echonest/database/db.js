// handles connection, to use by other stuffs
var pg = require('pg');

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
        if (err) {
            console.error(err);
            return ;
        }
        client.query(queryStr, function(err, result) {
			if (err) {
				console.error(
                    JSON.stringify({query: queryStr, error: err})
                );
			}
          done();          
	      resultCallBack && resultCallBack(result, err);
        })
  });
}