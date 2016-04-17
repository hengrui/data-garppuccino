var Discogs = require('disconnect').Client;
var db = new Discogs().database();
var fs = require('fs');
var outputFilenames = 'discorgs/myData_';// release '.json';
var unfoundIDContainers = 'discorgs/unfoundIDs_'; //release.txt',

function release(start, upperBound) {
	var item = start;
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
				var outputData = JSONdata + ',\n';
				fs.appendFileSync(outputFilenames+'release.json', outputData);
			} else {
				console.log('No data for release_id= ' + item);;
				var outputID = item + '\n';
				fs.appendFileSync(unfoundIDContainers+'release.txt', outputID);
			}
		});
		if (item >= upperBound) {
			clearInterval(timeout);
		}		
	}, 321);
}
exports.release = release;

function artist(start, upperBound) {
	var item = start;
	var timeout = setInterval(function() {
		item++;
		var JSONdata;
		var outputData;
		db.artist(item, function(err, data){
			if (data == undefined){
			} else
			if (data.message == undefined){
				console.log('Receive Info for artist_id= ' + data.id);
				JSONdata = JSON.stringify(data);
				var outputData = JSONdata + ',\n';
				fs.appendFileSync(outputFilenames+'artist.json', outputData);
			} else {
				console.log('No data for artist_id= ' + item);;
				var outputID = item + '\n';
				fs.appendFileSync(unfoundIDContainers+'artist.txt', outputID);
			}
		});
		if (item >= upperBound) {
			clearInterval(timeout);
		}		
	}, 321);
}
exports.artist = artist;

function label(start, upperBound) {
	var item = start;
	var timeout = setInterval(function() {
		item++;
		var JSONdata;
		var outputData;
		db.label(item, function(err, data){
			if (data == undefined){
			} else
			if (data.message == undefined){
				console.log('Receive Info for label_id= ' + data.id);
				JSONdata = JSON.stringify(data);
				var outputData = JSONdata + ',\n';
				fs.appendFileSync(outputFilenames+'label.json', outputData);
			} else {
				console.log('No data for label_id= ' + item);;
				var outputID = item + '\n';
				fs.appendFileSync(unfoundIDContainers+'label.txt', outputID);
			}
		});
		if (item >= upperBound) {
			clearInterval(timeout);
		}		
	}, 321);
}
exports.label = label;

function master(start, upperBound) {
	var item = start;
	var timeout = setInterval(function() {
		item++;
		var JSONdata;
		var outputData;
		db.master(item, function(err, data){
			if (data == undefined){
			} else
			if (data.message == undefined){
				console.log('Receive Info for master_id= ' + data.id);
				JSONdata = JSON.stringify(data);
				var outputData = JSONdata + ',\n';
				fs.appendFileSync(outputFilenames+'master.json', outputData);
			} else {
				console.log('No data for master_id= ' + item);;
				var outputID = item + '\n';
				fs.appendFileSync(unfoundIDContainers+'master.txt', outputID);
			}
		});
		if (item >= upperBound) {
			clearInterval(timeout);
		}		
	}, 321);
}
exports.master = master;

