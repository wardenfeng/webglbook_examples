/// <reference path="../text\out\text.d.ts" />


// RotateObject.js (c) 2012 kanda and matsuda
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
  'precision mediump float;\n' +
  'uniform sampler2D u_Sampler;\n' +
  'varying vec2 v_TexCoord;\n' +
  'void main() {\n' +
  '  gl_FragColor = texture2D(u_Sampler, v_TexCoord);\n' +
  '}\n';

function main()
{
  // Retrieve <canvas> element
  var canvas = document.getElementById("webgl");

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl)
  {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE, ['a_Position', 'a_TexCoord']))
  {
    console.log('Failed to initialize shaders');
    return;
  }

  // Set the vertex information
  if (!initVertexBuffers(gl, canvas))
  {
    console.log('Failed to set the vertex information');
    return;
  }

  // Set texture
  if (!initTextures(gl))
  {
    console.log('Failed to intialize the texture.');
    return;
  }

  draw(gl);

  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
var pbuffer1;
var a_Position;
function initVertexBuffers(gl, canvas)
{
  var positions = [
    -1, 1,
    -1, -1,
    1, 1,
    1, -1
  ];
  var texCoords = [
    0.0, 1.0,
    0.0, 0.0,
    1.0, 1.0,
    1.0, 0.0,
  ];

  // Create a buffer object
  var pbuffer = gl.createBuffer();
  var tbuffer = gl.createBuffer();
  if (!pbuffer || !tbuffer)
  {
    console.log('Failed to create buffer object(s)');
    return false;
  }

  // Write vertex information to buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, pbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var offset = 2 / canvas.width;

  pbuffer1 = gl.createBuffer();
  for (var i = 0; i < positions.length; i += 2)
  {
    positions[i] += offset;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, pbuffer1);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  //
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0)
  {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  // Set texture coordinates
  gl.bindBuffer(gl.ARRAY_BUFFER, tbuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  if (a_TexCoord < 0)
  {
    console.log('Failed to get the storage location of a_TexCoord');
    return -1;
  }
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_TexCoord);

  return true;
}

function initTextures(gl)
{
  // Get the storage location of u_Sampler
  var samplerLoc = gl.getUniformLocation(gl.program, 'u_Sampler');
  if (!samplerLoc)
  {
    console.log('Failed to get the storage location of u_Sampler');
    return false;
  }

  // Create a texture
  var texture = gl.createTexture();
  if (!texture)
  {
    console.log("Failed to create the texture");
    return false;
  }

  // Create <canvas> to draw a text
  var textCanvas = document.createElement('canvas');
  if (!textCanvas)
  {
    console.log('Failed to create canvas');
    return false;
  }

  // Set the size of <canvas>
  textCanvas.width = 256;
  textCanvas.height = 256;

  var textStyle = new text.TextStyle();
  textStyle.fontFamily = "bold sans-serif";
  // textStyle.dropShadow = true;
  textStyle.fontSize

  text.drawText(textCanvas, "matsuda 🌷 lea", textStyle);

  textCanvas.width;
  textCanvas.height;

  // Load texture
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  // Flip the image Y coordinate
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);

  // Set texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  // Pass the texure unit 0 to u_Sampler
  gl.uniform1i(samplerLoc, 0);

  return true;
}

function draw(gl)
{
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
