var fs = require('fs'),
    request = require('request'),
    path = require('path');

var files = [];

var download = function(uri, filename){
	var basename = path.basename(uri);
	request(uri).pipe(fs.createWriteStream(path.join('./public/img/news', basename)));
};

var filesLength = files.length;
for(var i=0;i<filesLength;i++) {
	(function () {
		var file = files[i];
		download(file);
	})()
}