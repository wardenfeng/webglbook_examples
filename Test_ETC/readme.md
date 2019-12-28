#### 解决Android平台ETC1压缩纹理

#### 生成压缩纹理数据

1. https://www.khronos.org/opengles/sdk/tools/KTX/
1. https://github.com/Ericsson/ETCPACK
1. https://github.com/KhronosGroup/KTX-Software
1. https://developer.arm.com/search#q=%20Mali%20Texture%20Compression%20Tool
1. https://github.com/BabylonJS/Babylon.js/blob/master/Tools/CompressedTextured/make-ktx-batch.bat
1. https://github.com/evolution-gaming/babylonjs-texture-generator
1. https://docs.imgtec.com/PVRTexTool_Manual/topics/pvrtextool_commandline.html?hl=pvrtextoolcli


#### 加载并上传GPU使用
1. https://github.com/BabylonJS/Babylon.js/blob/master/src/Misc/khronosTextureContainer.ts
1. https://github.com/mrdoob/three.js/blob/dev/examples/js/loaders/KTXLoader.js

#### 压缩纹理
使用 tools/Mali_Texture_Compression_Tool_v4,-d-,3,-d-,0,-d-,b81c088_Windows_x64.exe ,需要安装或者使用安装后得到的Mali Texture Compression Tool v4.3.0\bin\etcpack.exe调用命令压缩。

#### 实现
1. 示例入口 index.js、
1. ETC压缩纹理数据的文件KTX文件加载解析
    ```
    // 加载ETC压缩纹理
    var url = 'resources/disturb_ETC1.ktx';
    var url = 'resources/1.ktx';

    var loader = new KTXLoader();
    loader.load(url, (ktxData) =>
    {
        loadTexture(gl, n, texture, u_Sampler, ktxData);
    });
    ```
1. 获取（启用webgl扩展）
    ```
    gl.getExtension('WEBGL_compressed_texture_etc1');
    ```
1. 启用混合
    ```
    // Enable alpha blending
    gl.enable(gl.BLEND);
    // Set blending function
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    ```
1. 上传纹理数据到GL
    ```
    for (var i = 0; i < ktxData.mipmaps.length; i++)
    {
        var mipmap = ktxData.mipmaps[i];
        gl.compressedTexImage2D(gl.TEXTURE_2D, i, ktxData.format, mipmap.width, mipmap.height, 0, mipmap.data);
    }
    ```
1. 透明度在shader中使用
    ```
    gl_FragColor.xyz = texture2D(u_Sampler, fract(v_TexCoord) * vec2(1.0,0.5)).xyz;
    gl_FragColor.w = texture2D(u_Sampler, fract(v_TexCoord) * vec2(1.0,0.5) + vec2(0.0,0.5)).x;
    ```
