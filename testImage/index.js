// TexturedQuad.js (c) 2012 matsuda and kanda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

var gl;
var u_Sampler;
var n;
var canvas;

function main()
{
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = getWebGLContext(canvas);
  if (!gl)
  {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE))
  {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Set the vertex information
  n = initVertexBuffers(gl);
  if (n < 0)
  {
    console.log('Failed to set the vertex information');
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!u_Sampler)
  {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  loadImages(urls, (imgs) =>
  {
    images = imgs;
    textures = images.map(img => loadTexture(gl, img));
  });

  requestAnimationFrame(update)
}

function initVertexBuffers(gl)
{
  var verticesTexCoords = new Float32Array([
    // Vertex coordinates, texture coordinate
    -1, 1, 0.0, 1.0,
    -1, -1, 0.0, 0.0,
    1, 1, 1.0, 1.0,
    1, -1, 1.0, 0.0,
  ]);
  var n = 4; // The number of vertices

  // Create the buffer object
  var vertexTexCoordBuffer = gl.createBuffer();
  if (!vertexTexCoordBuffer)
  {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexTexCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verticesTexCoords, gl.STATIC_DRAW);

  var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;
  //Get the storage location of a_Position, assign and enable buffer
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0)
  {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
  gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

  // Get the storage location of a_TexCoord
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0)
  {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  // Assign the buffer object to a_TexCoord variable
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
  gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object

  return n;
}

function loadImage(url, callback)
{
  var image = new Image();  // Create the image object
  if (!image)
  {
    console.log('Failed to create the image object');
    return false;
  }
  // Register the event handler to be called on loading an image
  image.onload = function () { callback(image); };
  // Tell the browser to load an image
  image.src = url;
}

function loadImages(urls, callback, images)
{
  images = images || [];
  if (urls.length == 0)
  {
    callback(images);
    return;
  }
  var url = urls.pop();
  loadImage(url, (image) =>
  {
    // document.body.appendChild(image);
    images.push(image);
    loadImages(urls, callback, images);
  });
}

function loadTexture(gl, image)
{
  var texture = gl.createTexture();   // Create a texture object
  if (!texture)
  {
    console.log('Failed to create the texture object');
    return false;
  }
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  //
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // Set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  return texture;
}

function draw(gl, n, texture, u_Sampler)
{
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  // Set the texture unit 0 to the sampler
  gl.uniform1i(u_Sampler, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n); // Draw the rectangle
}

var images = [];
var textures = [];
var urls = [

  '../resources/7herbs.JPG',
  '../resources/blueflower.JPG',
  '../resources/blueflower2.JPG',
  '../resources/circle.gif',
  '../resources/lightblueflower.JPG',
  '../resources/numbers.png',
  '../resources/orange.JPG',
  '../resources/parasol.jpg',
  '../resources/particle.png',
  '../resources/pinkflower.JPG',
  '../resources/redflower.jpg',
  '../resources/sky_cloud.jpg',
  '../resources/sky_roof.JPG',
  '../resources/sky.JPG',
  '../resources/yellowflower.jpg',
];

function update()
{
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  var length = textures.length;
  length = Math.ceil(Math.sqrt(length));
  textures.forEach((texture, index) =>
  {
    gl.viewport(Math.floor(index / length) / length * canvas.width, (index % length) / length * canvas.height, canvas.width / length, canvas.height / length);

    draw(gl, n, texture, u_Sampler);
  });

  requestAnimationFrame(update)
}