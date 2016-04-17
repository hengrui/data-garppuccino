var Discogs = require('disconnect').Client;
var db = new Discogs({userToken: 'UTmffTrAysekfTDiZXhTlSshcnkEiXHgmuisWyvv'}).database();
var params = {
	type: "artist",
	per_page: "100",
	page: "1"
};
var option = process.argv;
var name = '';
(function(){
	if (option.length > 2){
		name = option[2];
		for (var i = 3; i < option.length; i++)
			name = name + ' '+ option[i];
	} else {
		return ;
	}
	db.search(name, params, function(err, data){
		var pages = data.pagination.pages;
		console.log(pages);
		var obj = params;
		for (var i = 1; i <= pages; i++){
			obj["page"] = "" + i;
			console.log(obj);
			db.search(name, obj, function(err, data){
				if (err) {
	
				} else {
					console.log(data.pagination.page);
				}
			});
		}
	});
})();
