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
		for (var i = 0; i < obj.length; i++){
			output['artist'].push(obj[i]);
		}
		var xml_content = js2xmlparser('ArtistSet', output);
		fs.writeFile(option[3], xml_content, 'utf8', function(err, data){
			if (err){
				console.log('Writing fails');
			} else {
				console.log('XML file has been generated');
			}
		});
	}

});
