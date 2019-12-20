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
  image.onerror = function () { callback(); };
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
    if (image)
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

function update()
{
  gl.clear(gl.COLOR_BUFFER_BIT);   // Clear <canvas>

  var textures = obj.textures;

  var length = textures.length;
  length = Math.ceil(Math.sqrt(length));
  textures.forEach((texture, index) =>
  {
    gl.viewport(Math.floor(index / length) / length * canvas.width, (index % length) / length * canvas.height, canvas.width / length, canvas.height / length);

    draw(gl, n, texture, u_Sampler);
  });

  requestAnimationFrame(update)
}

var obj = {
  images: [],
  textures: [],
  urls: [],

  loadImages: function ()
  {
    loadImages(obj.urls.concat(), (imgs) =>
    {
      obj.images = imgs;
      alert(`images is loaded! ${obj.images.length}`)
    });
  },
  loadTextures: function ()
  {
    obj.textures = obj.images.map(img => loadTexture(gl, img));

    alert(`textures is loaded! ${obj.textures.length}`)
  },
  clearImages: function ()
  {
    obj.images = [];
    alert(`images is clean! ${obj.images.length}`)
  },
  clearTextures: function ()
  {
    obj.textures.forEach(t =>
    {
      gl.deleteTexture(t);
    });
    obj.textures = [];
    alert(`textures is clean! ${obj.textures.length}`)
  },
};

var gui = new dat.GUI();
gui.add(obj, 'loadImages');
gui.add(obj, 'loadTextures');
gui.add(obj, 'clearImages');
gui.add(obj, 'clearTextures');

obj.urls = [
  "./images/0000_fs_female_body.png",
  "./images/0000_fs_female_hair.png",
  "./images/0000_male_body_d.png",
  "./images/0000_male_hand_d.png",
  "./images/0000_male_leg_d.png",
  "./images/0000_zs_male_body.png",
  "./images/0000_zs_male_hair.png",
  "./images/0001_archangel_asi.png",
  "./images/0001_archangel.png",
  "./images/0001_fs_male_head_d.png",
  "./images/0001_magic_magic.png",
  "./images/0001_male_face_d.png",
  "./images/0001_shengyi_male_body_d.png",
  "./images/0001_shengyi_male_hand_d.png",
  "./images/0001_shengyi_male_head_d.png",
  "./images/0001_shengyi_male_leg_d.png",
  "./images/0001_shengyi_male_shoulder_d.png",
  "./images/0001_ss_female_body_lg.png",
  "./images/0001_ss_female_body.png",
  "./images/0001_ss_female_feet_lg.png",
  "./images/0001_ss_female_feet.png",
  "./images/0001_ss_female_hand_lg.png",
  "./images/0001_ss_female_hand.png",
  "./images/0001_ss_female_helmet_lg.png",
  "./images/0001_ss_female_helmet.png",
  "./images/0001_ss_female_leg_lg.png",
  "./images/0001_ss_female_leg.png",
  "./images/0001_zs_male_sword.png",
  "./images/1.png",
  "./images/2_lyxz_liba_001_alpha.png",
  "./images/0002_magic_magic.png",
  "./images/0002_sword_sword.png",
  "./images/002.png",
  "./images/2x2.png",
  "./images/0006_magic_magic.png",
  "./images/0007_magic_magic.png",
  "./images/7herbs.JPG",
  "./images/028_guangyun.png",
  "./images/70_buliding_kushu_001_001_alpha.png",
  "./images/87_terrain_01_yz.png",
  "./images/87_terrain_01.png",
  "./images/89_building_zhalan_001_alpha.png",
  "./images/89_dixing_001.png",
  "./images/89_huacao_001_alpha.png",
  "./images/89_jixie_001_03_alpha.png",
  "./images/89_maitian_001_alpha.png",
  "./images/89_shuichi_001_diff.png",
  "./images/89_tree_dashu_001_01_alpha.png",
  "./images/89_tree_shucong_001_alpha.png",
  "./images/89_tree_xiaoyeguanmu_001_alpha.png",
  "./images/89_xiaocao_001_alpha.png",
  "./images/89_zhiwu_001_alpha.png",
  "./images/117e875620d52496fb971dbf6724624d.png",
  "./images/0122_huanghunshibing_asi.png",
  "./images/0122_huanghunshibing_d.png",
  "./images/0189.png",
  "./images/0278.png",
  "./images/0326_01.png",
  "./images/0350.png",
  "./images/0351.png",
  "./images/0458.png",
  "./images/0473.png",
  "./images/0556.png",
  "./images/0557.png",
  "./images/0592.png",
  "./images/0692.png",
  "./images/0961.png",
  "./images/1525_firedragon02_d.png",
  "./images/10004_grass.png",
  "./images/10004a_gemstone.png",
  "./images/10004a_t01.png",
  "./images/10004a_t03.png",
  "./images/10004a_t04.png",
  "./images/10101_glass01.png",
  "./images/10204.png",
  "./images/10502_glass.png",
  "./images/aaaa.png",
  "./images/alien-shark.png",
  "./images/anc_tengwan_001_alpha.png",
  "./images/AO.png",
  "./images/arcaneTorrent_ring.png",
  "./images/arrow.png",
  "./images/background.png",
  "./images/baihu.png",
  "./images/baihuan.png",
  "./images/baihumao.png",
  "./images/baihuya.png",
  "./images/baise.png",
  "./images/bar_albedo.png",
  "./images/basecolor.png",
  "./images/bg-blocks.png",
  "./images/bg-mountains.png",
  "./images/bg.png",
  "./images/binglong_d.png",
  "./images/blank.png",
  "./images/blueflower.JPG",
  "./images/blueflower2.JPG",
  "./images/bobby-board.png",
  "./images/box.png",
  "./images/brdf.png",
  "./images/building_3_1_albedo.png",
  "./images/Building_4_albedo.png",
  "./images/Buildings.png",
  "./images/c_point03a.png",
  "./images/c_point077a.png",
  "./images/c_ring344a.png",
  "./images/Carpet01_D.png",
  "./images/Carpet03_D.png",
  "./images/caustics.png",
  "./images/chosen-sprite.png",
  "./images/chosen-sprite@2x.png",
  "./images/circle.gif",
  "./images/coffee_shop_albedo.png",
  "./images/color.png",
  "./images/comp.json.png",
  "./images/constructor_diffuse.png",
  "./images/coral_plant.png",
  "./images/coral_rock.png",
  "./images/coralbank1.png",
  "./images/coralbank2.png",
  "./images/coralbank3.png",
  "./images/coralbank4.png",
  "./images/cube_specular_1.png",
  "./images/cube_texture_1.png",
  "./images/cutbg.png",
  "./images/daji_ssgd_2_2.png",
  "./images/daoguang_01.png",
  "./images/dieren_01.png",
  "./images/dot.png",
  "./images/dragon.png",
  "./images/E_glow001.png",
  "./images/E_guangyun_125.png",
  "./images/E_huo01.png",
  "./images/EF_decal_yp.png",
  "./images/EF_Flare07.png",
  "./images/EF_LightLine01pc2s.png",
  "./images/EF_PC1_TRAILs2.png",
  "./images/EF_PC2_SKILL01_line.png",
  "./images/EF_wind_Swirl3gray_b.png",
  "./images/EF_wind_tiled2_da.png",
  "./images/Effects_Textures_232-1.png",
  "./images/f_fire010a_4x4.png",
  "./images/f_fire035a_5x2.png",
  "./images/fa_zhen_hlb.png",
  "./images/fire.png",
  "./images/Flags.png",
  "./images/forestbuild33.png",
  "./images/fs_1.png",
  "./images/FS_head_01_alpha.png",
  "./images/fz_sj1.png",
  "./images/GF_2500.png",
  "./images/GJ.png",
  "./images/glow_1.png",
  "./images/glow_00022.png",
  "./images/glow1111111.png",
  "./images/grad01_14iv.png",
  "./images/GS_005_alpha.png",
  "./images/GS_005_chest_diff.png",
  "./images/GS_005_foot_diff.png",
  "./images/GS_chest_01_diff.png",
  "./images/GS_foot_01_diff.png",
  "./images/GS_hand_01_diff.png",
  "./images/GS_head_01_alpha.png",
  "./images/GS_leg_01_diff.png",
  "./images/GS_weapon_005_alpha.png",
  "./images/GS_wing_012_diff.png",
  "./images/GS_wing_012_mask.png",
  "./images/GS_wing_012_mask1.png",
  "./images/gx.png",
  "./images/Hay01_D.png",
  "./images/i_16_add.png",
  "./images/i_16_cHorizontal.png",
  "./images/i_16_downT.png",
  "./images/i_16_selector.png",
  "./images/i_16_settings.png",
  "./images/island-pipesmoss_AO.png",
  "./images/jitan.png",
  "./images/joystick0.png",
  "./images/joystick1.png",
  "./images/Kratos_Albedo.png",
  "./images/Kratos_Gloss.png",
  "./images/Kratos_Normal.png",
  "./images/Kratos_Opacity.png",
  "./images/Kratos_Specular.png",
  "./images/L_Roads_AlbedoTransparency.png",
  "./images/LD.png",
  "./images/len_01.png",
  "./images/LF01_14.png",
  "./images/lg_bai.png",
  "./images/lg_black.png",
  "./images/lg_green.png",
  "./images/lg_hui.png",
  "./images/light0029.png",
  "./images/lightblueflower.JPG",
  "./images/Lightmap-0_comp_light.png",
  "./images/Lightmap-1_comp_light.png",
  "./images/LightmapFar-0.png",
  "./images/LightmapFar-1.png",
  "./images/lightning001.png",
  "./images/lightning01.png",
  "./images/lightning2x4_blue.png",
  "./images/logo.png",
  "./images/M_0035.png",
  "./images/m_sky_blue_mraky.png",
  "./images/MainCity_leaf.png",
  "./images/Map_Castle_build_01.png",
  "./images/Map_Castle_build_02.png",
  "./images/Map_Castle_build_03.png",
  "./images/Map_Castle_build_04.png",
  "./images/Map_Castle_floor.png",
  "./images/Map_Castle_stone.png",
  "./images/map_diffuse.png",
  "./images/map_normal.png",
  "./images/Map_red.png",
  "./images/mask.png",
  "./images/menu-backdrop.png",
  "./images/metallicRoughness.png",
  "./images/Moon.png",
  "./images/Motel_2_albedo.png",
  "./images/Mountains.png",
  "./images/normal.png",
  "./images/normals.png",
  "./images/num.png",
  "./images/onepiece.png",
  "./images/orange.JPG",
  "./images/p_halo024a.png",
  "./images/palm.png",
  "./images/parasol.JPG",
  "./images/particle.png",
  "./images/ParticleFirecloud.png",
  "./images/ParticleFlamesSheet.png",
  "./images/pc_cape_000d.png",
  "./images/pc_wing_001a.png",
  "./images/pc1_body_000a.png",
  "./images/pc1_foot_000a.png",
  "./images/pc1_hand_000a.png",
  "./images/pc1_head_000a.png",
  "./images/pc2_body_000a.png",
  "./images/pc2_foot_000a.png",
  "./images/pc2_hand_000a.png",
  "./images/pc2_head_000a.png",
  "./images/photon_jin.png",
  "./images/pinkflower.JPG",
  "./images/Plant_04.png",
  "./images/Plant01_D.png",
  "./images/Plant03.png",
  "./images/props_albedo.png",
  "./images/Q_0169.png",
  "./images/redflower.JPG",
  "./images/reef-shark-512.png",
  "./images/reef-shark-1024.png",
  "./images/Road_01_AlbedoTransparency.png",
  "./images/Road_02_AlbedoTransparency.png",
  "./images/road_albedo.png",
  "./images/rock_n256_1.png",
  "./images/rock_n256.png",
  "./images/rock256.png",
  "./images/Rockface.png",
  "./images/sand-edge.png",
  "./images/sand-placeholder.png",
  "./images/sd_hlb_1.png",
  "./images/sf_rgb_overlap.png",
  "./images/shader.png",
  "./images/shandian_00094.png",
  "./images/shu.png",
  "./images/signs-updown.png",
  "./images/signs.png",
  "./images/sky_cloud.JPG",
  "./images/sky_roof.JPG",
  "./images/sky-above.png",
  "./images/sky-below.png",
  "./images/sky-stars.png",
  "./images/sky.JPG",
  "./images/small_coral.png",
  "./images/sparkles.png",
  "./images/splash.png",
  "./images/STXINGKA.TTF.png",
  "./images/sunkencity.png",
  "./images/surface.png",
  "./images/swingFX.png",
  "./images/t_0012lvyeshu_obj_p_d.png",
  "./images/t_a_paopao.png",
  "./images/T_Roads_AlbedoTransparency.png",
  "./images/tank01.png",
  "./images/tank02.png",
  "./images/textures_d1 - 副本.png",
  "./images/textures_d1.png",
  "./images/thickness.png",
  "./images/town.png",
  "./images/tra1il_t.png",
  "./images/trailtest 2_00000.png",
  "./images/trailtest_yellow.png",
  "./images/trailtest.png",
  "./images/trailtest2_00000.png",
  "./images/trailtest2.png",
  "./images/treasurechest.png",
  "./images/Trees.png",
  "./images/ui_3043-120.png",
  "./images/ui_boundary_close_in.png",
  "./images/ui_boundary_close.png",
  "./images/ui_lianji_0.png",
  "./images/ui_lianji_1.png",
  "./images/ui_lianji_2.png",
  "./images/ui_lianji_3.png",
  "./images/ui_lianji_4.png",
  "./images/ui_lianji_5.png",
  "./images/ui_lianji_6.png",
  "./images/ui_lianji_7.png",
  "./images/ui_lianji_8.png",
  "./images/ui_lianji_9.png",
  "./images/ui_public_button_1.png",
  "./images/ui_public_button_hits.png",
  "./images/ui_public_input.png",
  "./images/uiMask.png",
  "./images/uisprite.png",
  "./images/uvsphere.png",
  "./images/uvSprite.png",
  "./images/war.png",
  "./images/Water_01.png",
  "./images/water-midFE.png",
  "./images/Wave9_1.png",
  "./images/Weapon_dan_005_diff_01.png",
  "./images/Weapon_dan_005_diff.png",
  "./images/Weapon_dun_020_xing.png",
  "./images/wp_ds_000a_001a_002a.png",
  "./images/X_Roads_AlbedoTransparency.png",
  "./images/Xielong_boss_d.png",
  "./images/xxx.png",
  "./images/Y_0225.png",
  "./images/yellowflower.JPG",
  "./images/Z_0008.png",
  "./images/zg03_256.png",
  "./images/zg03.png",
  "./images/zg256.png",
  "./images/ZS_chest_005_diff.png",
  "./images/ZS_foot_005_diff.png",
  "./images/ZS_hand_005_diff.png",
  "./images/ZS_head_005_diff.png",
  "./images/ZS_leg_005_diff.png",
  "./images/ZS_wing_012_diff.png",
  "./images/ZS_wing_012_mask.png",
];