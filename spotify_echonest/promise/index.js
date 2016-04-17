//just a slight promise injection to help things easier
require('promise/lib/rejection-tracking').enable(
  {allRejections: true}
);

var Promise = require('promise');

if (!Promise.prototype.spread) {
    Promise.prototype.spread = function (fn) {
        return this.then(function (args) {
            return Promise.all(args); // wait for all
        }).then(function(args){
         //this is always undefined in A+ complaint, but just in case
            return fn.apply(this, args); 
        });

    };

}
module.exports = Promise;