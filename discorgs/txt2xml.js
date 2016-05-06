var line_by_line = require('n-readlines');
var liner = new line_by_line('./total_merged.txt');
var fs = require('fs');
var line_num = 0;
var data_num = 0;
var data = [];
var js2xmlparser = require('js2xmlparser');

(function(){
	while (line = liner.next()){
		if (line_num == 0){
		//Get the attributes of the table
			var str = line.toString();
			var attributes = str.split('|');
			for (var i = 0; i < attributes.length; i++){
				attributes[i] = attributes[i].trim();
			}
		} else if (line_num == 1){
		//This line is just useless
		} else {
			var tmp = line.toString().split('|');
			for (var i = 0; i < tmp.length; i++){
				tmp[i] = tmp[i].trim();
			}
			data[data_num] = tmp;
			data_num++;
		}
		line_num++;
	}
	//console.log(data);
	console.log(data_num);
	//Start processing data into xml format
	var output = {};
	output['record'] = [];
	//ignore last two lines that contain a metadata
	for (var i = 0; i < data_num - 2; i++){
		var detail = {};
		detail['attribute'] = [];
		for (var j = 0; j < attributes.length; j++){
			var tmp = {
				"@": {
					"name": attributes[j]
				},
				"value": data[i][j]
			}
			detail['attribute'].push(tmp);
		}
		output['record'].push(detail);
	}
	var xml_content = js2xmlparser('recordSet', output);
	fs.writeFile(process.argv[2], xml_content, 'utf8', function(err){
		if (err){
			console.log(err);
		} else {
			console.log('XML file has been generated');
		}
	});

})();
