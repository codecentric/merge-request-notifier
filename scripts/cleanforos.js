var exec = require('child_process').exec
function puts(error, stdout, stderr) {
    console.log(stdout)
}

var os = require('os')
//control OS
//then run command depengin on the OS

if (os.type() === 'Windows_NT') exec('yarn clean-windows', puts)
else exec('yarn clean-linux', puts)
