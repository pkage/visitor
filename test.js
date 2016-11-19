var sudo = require('sudo-prompt');

var options = {
	name: 'visitor'
};

sudo.exec('echo hello', options, (err, stdout, stderr) => {
	console.log("err");
	console.log(err);
	console.log("stdout");
	console.log(stdout);
	console.log("stderr");
	console.log(stderr);
})