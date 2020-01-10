### 游戏引擎中文本实现方式

实现方式主要有以下两种
    
1. Canvas绘制
    * 实现方式
        * 从 HTMLCanvasElement 获取一个 CanvasRenderingContext2D
        * 使用 CanvasRenderingContext2D 提供的API绘制文本
            * 根据`文本样式`设置 CanvasRenderingContext2D 属性
            * 根据`文本样式`计算 绘制文字（文本）位置
            * 绘制文字（文本）
        * [可选] 使用 CanvasRenderingContext2D.getImageData 转换为 ImageData
        * 上传作为纹理使用
    * 优势
        * 完全利用原始API实现
        * 丰富的字体
        * 文本渐变
        * 描边
        * 阴影
    * 劣势
        * 平台支持 CanvasRenderingContext2D
        * 使用多个canvas

1. 纹理字体
    * 实现方式
        * 使用工具生成出`特定字号特定字体`的`字符图集`与`描述文件`
        * 从绘制文本中获取`字符列表`与`描述文件`以及`文本样式`生成网格数据
        * 以`字符图集`作为纹理进行绘制
    * 优势
        * 不需要额外canvas，也不需要支持 CanvasRenderingContext2D
    * 劣势
        * 需要些额外shader代码
        * 不同字体甚至不同字号都需要有额外的`字符图集`与`描述文件`
        * 实现文本渐变，描边，阴影均需要额外的shader代码，甚至多次绘制
    * 相关技术
        * SDF font 全称 signed distance field font 中文名称 有向距离场字体
            * 使用有向距离场技术来让文本渲染更加清晰的技术
            * 实现方式
                * 生成 SDF font 字符图集
                    * 拿到生成的`字符图集`与`描述文件`对每个字符做以下操作
                    * 对每个像素做周围半径`最大距离`像素遍历找到不同像素的最小距离作为像素值存储 [该过程`最大距离`越大所需时间呈平方增长！一般该操作使用工具操作。]
                * 在shader中根据位图数字判断文字边界进行绘制文本
            * 优势
                * 绘制出的文本更加清晰
                * shader中寻找文字边界使得制作描边更容易
                * 在缩小`字符图集`一定程度后依然可以保持清晰绘制
            * 劣势
                * 只支持纯黑白字体
                * 描边宽度限制在`最大距离`内

#### phaser 

[![](images/phaser.png)](https://github.com/photonstorm/phaser)

1. [Text](https://github.com/photonstorm/phaser/blob/master/src/gameobjects/text/static/Text.js) 使用第一种实现方式。