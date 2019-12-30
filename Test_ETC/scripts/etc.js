const { execFile } = require('child_process');
const path = require("path");

var fun = function ()
{
    var exePath = path.resolve(__dirname, "../tools/mali/etcpack.exe");
    var exeDir = path.dirname(exePath);

    var input = path.resolve(__dirname, "orange.JPG");
    var outDir = path.resolve(__dirname, "out");

    // execFile(exeDir + '/etcpack.exe', [input, outDir, `-s`, `fast`, `-c`, `etc1`, `-ktx`, `-aa`], { cwd: exeDir }, function (err, data)
    execFile(exePath, [input, outDir, `-s`, `fast`, `-c`, `etc1`, `-ktx`, `-aa`], { cwd: exeDir }, function (err, data)
    {
        console.log(`error: ` + err)

        console.log(data.toString());
    });
}

fun();