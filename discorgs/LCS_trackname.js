var arr = 
['12 Etudes, Op.10: No. 8. in F', '12 Etudes, Op.10: No. 8. in C', '12 Etudes, Op.10: No. 8. in A minor "chromatique"', '12 Etudes, Op.10: No. 8. in C sharp minor', '12 Etudes, Op.10: No. 8. in F minor', '12 Etudes, Op.10: No. 8. in E flat minor', '12 Etudes, Op.10: No. 8. in C'];
var Set = require('collections/set');
var LCS_set = new Set();
var length_voting = {};
var max_length = 0;
var content_voting = [];

for (var i  = 0; i < arr.length; i++){
	var str = arr[i].split(' ');
	for (var j = 0; j < str.length; j++){
		content_voting[j] = {};
	}
}

for (var i = 0; i < arr.length; i++){
	var str = arr[i].split(' ');
	for (var j = 0; j < str.length; j++){
		var tmp = content_voting[j];
		if(tmp[str[j]] == undefined){
			tmp[str[j]] = 1;
		} else {
			tmp[str[j]] += 1;
		}
		content_voting[j] = tmp;
	}
}
console.log(content_voting);
var result_str = '';
var flag = 0;
var threshold = arr.length * 0.8;
for (var i = 0; i < content_voting.length; i++){
	var key_counter = 0;
	var tmp = content_voting[i];
	var tmp_str;
	for (key in tmp){
		if (tmp[key] > key_counter){
			key_counter = tmp[key];
			tmp_str = key;
		}
	}

	if (key_counter >= threshold){
		if (flag != 0)
			result_str += ' ';
		result_str += tmp_str;
		flag = 1;
	}
}
result_str = result_str.trim();
/*if (result_str.charAt(result_str.length - 1) == 'n'
		&& result_str.charAt(result_str.length - 2) == 'i')
	result_str = result_str.substring(0, result_str.length - 2);
*/
	console.log(result_str);
