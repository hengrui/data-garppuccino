var fs = require('fs');
fs.readFile('./myData.json', 'utf8', function (err, data) {
	if (err) {
		console.log(err);
	} else {
		var obj = JSON.parse(data);
		console.log(obj.length);
		/*
		   for (i = 0; i < obj.length; i++){
			var row = obj[i];
			for (var myKey in row){
				console.log("key: " + myKey + ", value: " + row[myKey]);
			}
		}
		*/
	}
});
