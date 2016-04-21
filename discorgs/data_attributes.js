var Discogs = require('disconnect').Client;

var db = new Discogs().database();
// for gathering information about a release.
// other types could be label, master, artist 
/*
	404 Error:
	{message:"Release not found"}


   Release
   
   Possible attributes:
   status, styles, videos[]{duration, description, embed, uri, titile},
   series[], released_formatted, labels[]{name, entity_type, catno, resource_url, id, entity_type_name},
   estimated_weight, community{status, rating{}, want, have, submitter{username, resource_url, data_quality}},
   released, master_url, year, date_added,
   artists[]{join, name, anv, tracks, role, resource_url, id},
   formats[], date_changed, images[]{uri, height, width, resource_url, type, uri150},
   format_quanlity, id, genres[], thumb, 
   extraartists[]{join, name, anv, tracks, role, resource_url, id},
   title, date_changed, resource_url, master_id, tracklist[]{duration, position, type_, title},
   country, notes, identifiers, 
   companies[]{name, entity_type, catno, resource_url, id, entity_type_name},
   uri, formats[]{text, qty, description, name}, resource_url, data_quality
*/
(function(){
var id = process.argv[2];
db.artist(id, function(err, data){
	console.log(data);
	//console.log(data.artists[0].id);
		});
})();
/*
   db.release(5563545, function(err, data){
	console.log('------------------------------------------------------');
	console.log(data);
	for (var i = 0; i < data.tracklist.length; i++){
		console.log('No.' + i + ' track');
		console.log('Title:' + data.tracklist[i].title);
		var duration = data.tracklist[i].duration;
		if (typeof duration !== 'undefined')
			console.log('Duration: ' + duration);
		var artists = data.tracklist[i].artists;
		if (typeof artists !== 'undefined'){
			console.log('Artist(s): ');
			for (var j = 0; j < artists.length; j++)
				console.log('    ' + artists[j].name + ', id = ' + artists[j].id);
		} 
		console.log('------------------------------------');
	}
});
*/

	
/*
   Label

   Possible attributes:
	profile, releases_url, name, contact_info, 
	parent_label{ resource_url, id, name}, uri,
	sublabels[]{resource_url, id, name}, urls[],
	images[]{uri, height, width, resource_url, type, uri150},
	id, resource_url, data_quality
db.label(30630, function (err, data){
	console.log(data);
});
*/

/*
   Master

   Possible attributes:
   styles[], genres[], videos[]{duration, embed, title, description, uri},
   title, main_release(num), main_release_url, year, uri, versions_url,
   artists[]{join, name, anv, tracks, resource_url, id},
   images[]{uri, height, width, resource_url, type, uri150},
   resource_url, tracklist[]{duration, position, type_, extraartists[], title},
   id, data_quality

   db.master(41619, function (err, data){
	console.log(data);
});
*/

/*
   Artist

   Possible attributes:
   profile, urls[], release_url, name, uri, images[]{uri, height, resource_url, type, uri150},
   id, data_quality, realname, groups[]{active, resource_url, id, name},
   aliases[]{resource_url, id, name}, namevariations[]
   db.artist(15885, function (err, data){
	console.log(data);
});
*/

/*var dis = new Discogs().setConfig({outputFormat: 'html'});
dis.database().release(176126, function (err, data){
		console.log(data);
});
*/

