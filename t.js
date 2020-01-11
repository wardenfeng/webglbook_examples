const canvas = document.createElement('canvas');
canvas.width = 400;
canvas.height = 300;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

ctx.fill = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.font = '12px serif';
ctx.fillStyle = "white";
ctx.textBaseline = "top";
ctx.fillText('Hello world', 0, 0, 140);



// ctx.font = '12px serif';
// ctx.fillText('Hello world', 50.5, 190, 140);


// var imagedata = ctx.getImageData(0, 0, 400, 100);
ctx.drawImage(canvas, 0.5, 100);