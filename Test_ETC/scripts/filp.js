const { execFile } = require('child_process');
const path = require("path");

// // 翻转图片
var imgPath = path.resolve(__dirname, "orange.JPG");
var outImgPath = path.resolve(__dirname, "orange1.JPG");

var exePath = path.resolve(__dirname, "../tools/mali/convert.exe");
var exeDir = path.dirname(exePath);

var args = [imgPath, "-flip", outImgPath];

execFile(exePath, args, { cwd: exeDir }, function (err, data)
{
    console.log(`error: ` + err)

    console.log(data.toString());
});