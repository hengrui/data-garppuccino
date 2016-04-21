/*

	Currently only restore release data.
	Most attributes constains single data while some of them has multiple
	values and others are complex.
	styles
		- mv arr
	videos
		- mv arr
			- each value is an object
				- duration
				- embed
				- title
				- description
				- uri
	series
		- sv arr, could be empty
	labels
		- arr, not sure whether it would be multiple
			- name
			- entity_type
			- catno
			- resource_url
			- id
			- entity_type_name
	community
		- complexed arr contains sv and mv attributes
			- status: 'Accepted' (dont know the meaning)
			- rating: two attrs
				- count
				- average
			- want
			- contributors: a series of user info.
				- username
				- resource_url
			- have
			- submitter: could be mv arr
				- username
				- resource_url
				- data_quality
	year
	images: mv arr
		- uri
			- height
			- width
			- resource_url
			- type
			- uri150
	format_quantity
	id
	genres: mv arr
	thumb (?)
	extraartists: mv arr
		- join (?)
		- name
		- anv
		- tracks
		- role
		- resource_url
		- id (artist id)
	title: string arr
	artists: mv arr
		- join (?)
		- name
		- anv
		- tracks
		- role
		- resource_url
		- id
	data_changed: str arr
	master_id
	tracklist: mv arr, each position contains track info.
		- duration
		- position
		- type_
		- title
	status: str arr
	released_formatted: str arr
	estimated_weight
	released: str arr		]
	date_added: str arr	]These two should be put together
	country: str arr
	notes: str arr, a short description
	identifiers: mv arr
		- type
		- description
		- value
	companies: mv arr
		- name
		- entity_type
		- catno
		- resource_url
		- id
		- entity_type_name
	uri: str arr
	formats: could be mv arr
		- qty
		- descriptions: mv arr
		- name
	resource_url
	data_quality
		

   */
var fs = require('fs');
var squel = require('squel');

var sql = squel.insert().into("discorgs");
fs.readFile('./myData.json', 'utf8', function (err, data) {
	if (err) {
		console.log(err);
	} else {
		var obj = JSON.parse(data);
		//console.log(obj.length);	//The number of retrieved data	
		//for (i = 0; i < obj.length; i++){
			var row = obj[0];// just test the frist obj
			var counter = 0;
			for (var myKey in row){
				counter++;
				sql.set(JSON.stringify(myKey), JSON.stringify(row[myKey]));
			}
			console.log("Attibute num: " + counter);
			console.log(sql.toString());
		//}
		
	}
});
