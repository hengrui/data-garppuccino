// handles connection, to use by other stuffs
var pg = require('pg');
var Promise = require('../promise');

var config = {
            user: "user",
            password: "bigdatahkust",
            database: "bigdata",
            port: 5432,
            host: "164.132.194.29",
            ssl: true
        };

var _ = module.exports = {};

_.query = function(queryStr) {
    return new Promise(function(resolve, reject) {
    	pg.connect(config, function(err, client, done) {
            if (err) {
                console.error(err);
                reject(err);
                return ;
            }
            client.query(queryStr, function(err, result) {
    			if (err) {
    				console.error(
                        JSON.stringify({query: queryStr, error: err})
                    );
                    reject(err);
    			}
              resolve(result);
              done();
            });
        });    
    });
}