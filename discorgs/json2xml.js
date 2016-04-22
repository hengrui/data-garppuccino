var js2xmlparser = require('js2xmlparser');
fs.readFile('./jsonData/myData_artist.json', 'utf8', function (err, data){
	if (err) {
		console.log(err);
	} else {
		var obj = JSON.parse(data);
		var output = {};
		output['artist'] = [];
		for (var i = 0; i < obj.length; i++){
			output['artist'].push(obj[i]);
		}
		console.log(js2xmlparser('ArtistSet', output));
	}

});
