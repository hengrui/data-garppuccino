var Discogs = require('disconnect').Client;
var db = new Discogs().database();
var fs = require('fs');
var outputFilename = 'myData.json';
var unfoundIDContainer = 'unfoundIDs.txt';
var outputData;
var async = require('async');
var arr = [];
var item = 220;

(function() {
	var c = 0;
	var timeout = setInterval(function() {
		item++;
		var JSONdata;
		var outputData;
		db.release(item, function(err, data){
			if (data == undefined){
			} else
			if (data.message == undefined){
				console.log('Receive Info for release_id= ' + data.id);
				JSONdata = JSON.stringify(data);
				outputData = JSONdata + ',\n';
				fs.appendFileSync(outputFilename, outputData);
			} else {
				console.log('No data for release_id= ' + item);;
				var outputID = item + '\n';
				fs.appendFileSync(unfoundIDContainer, outputID);
			}
		});
		c++;
		/*if (c > 2) {
			clearInterval(timeout);
		}
		*/
	}, 321);
})();
