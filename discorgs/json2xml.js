/*
 * In order to use RSwoosh, the xml should be in the below form:
 *	<attribute name="some_name">
 *		<value>
 *			first value
 *		</value>
 *		<value>
 *			second value
 *		</value>
 *		...
 *	</attribute>
 *
 *	The original matchInternal function compares two attributes' 
 *	values iteratively, which means once a pair of components equals
 *	these two attribute would be treated as the same and the function
 *	starts to compare remaining attributes.
 */

var fs = require('fs');
var js2xmlparser = require('js2xmlparser');
var option = process.argv;
fs.readFile(option[2], 'utf8', function (err, data){
	if (err) {
		console.log(err);
	} else {
		var obj = JSON.parse(data);
		var output = {};
		output['artist'] = [];		
		for (var i = 0; i < obj.length; i++){//obj.length; i++){
			var row = obj[i];
			var detail = {};
			detail['attribute'] = [];
			for (var myKey in row){
				var deRaw = row[myKey];
				var type = typeof deRaw;
				var	tmp;
				if (type != 'object'){
					tmp = {
						"@": {
							"name": myKey
						},
						"value": row[myKey]
					}
				} else {
					var data_in_deRaw = [];
					var flag = 0;
					for (var derawKey in deRaw){
						if (typeof deRaw[derawKey] == 'object'){
							flag = 1;
							//console.log('object');
							//console.log(deRaw[derawKey]);
							var complex_data = deRaw[derawKey];
							for (var c_key in complex_data){
								data_in_deRaw.push(complex_data[c_key]);
							}
						} else {
							tmp = {
								"@": {
									"name": myKey
								},
								"value": row[myKey]
							}
						}
					}
					if (flag) {
						tmp = {
							"@": {
								"name": myKey
							},
							"value": data_in_deRaw
						}
					}
				}
				detail['attribute'].push(tmp);
			}
			output['artist'].push(detail);
		}
		var xml_content = js2xmlparser('artistSet', output);
		//console.log(xml_content);
		fs.writeFile(option[3], xml_content, 'utf8', function(err, data){
			if (err){
				console.log('Writing fails');
			} else {
				console.log('XML file has been generated');
			}
		});
	}

});
