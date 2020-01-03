const { execFile } = require('child_process');
const path = require("path");

var fun = function ()
{
    var exePath = path.resolve(__dirname, "../tools/mali/etcpack.exe");
    var exeDir = path.dirname(exePath);

    var input = path.resolve(__dirname, "../resources/bg-blocks.png");
    var outDir = path.resolve(__dirname, "../resources");

    var isDiscardAlpha = false;

    // execFile(exeDir + '/etcpack.exe', [input, outDir, `-s`, `fast`, `-c`, `etc1`, `-ktx`, `-aa`], { cwd: exeDir }, function (err, data)

    var args = [input, outDir, `-s`, `fast`, `-c`, `etc1`, `-ktx`];
    if (!isDiscardAlpha)
        args.push("-aa");

    execFile(exePath, args, { cwd: exeDir }, function (err, data)
    {
        console.log(`error: ` + err)

        console.log(data.toString());
    });
}

fun();