var Discogs = require('disconnect').Client;
var db = new Discogs().database();
var fs = require('fs');
var outputFilename = 'discorgs/myData.json';
var unfoundIDContainer = 'discorgs/unfoundIDs.txt';
var outputData;
var async = require('async');
var arr = [];
var item = 0;
var upperBound = 10;//The searching upper boundary 
(function() {
	var timeout = setInterval(function() {
		item++;
		var JSONdata;
		var outputData;
		db.release(item, function(err, data){
			if (data == undefined){
			} else
			if (data.message == undefined){
				//console.log('Receive Info for release_id= ' + data.id);
				JSONdata = JSON.stringify(data);
				outputData = JSONdata;
				console.log(outputData);
				//fs.appendFileSync(outputFilename, outputData);
			} else {
				//console.log('No data for release_id= ' + item);;
				var outputID = item + '\n';
				fs.appendFileSync(unfoundIDContainer, outputID);
			}
		});
		if (item > upperBound) {
			clearInterval(timeout);
		}
		
	}, 3210);
})();
