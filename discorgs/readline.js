const readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var counter = 0;
rl.on('line', (cmd) => {
	counter++
	console.log('You just received: No.' + counter + ' data:');
	console.log(cmd);
});
