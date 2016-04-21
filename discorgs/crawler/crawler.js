var crawler = require("./crawler_methods.js");
var option = process.argv;
//option contain the argvs from command line in below form:
//0 : node
//1 : crawler.js
//2 : release/artist/label/master indicates the target db method
//3 : a number discribes the starting point
//4 : a number discribes the ending point
(function(){
	var method = option[2];
	var start = option[3];
	var end = option[4];
	switch (method){
		case 'release':
			crawler.release(start, end);
			break;
		case 'artist':
			crawler.artist(start, end);
			break;
		case 'label':
			crawler.label(start, end);
			break;
		case 'master':
			crawler.master(start, end);
			break;
	}
})();

