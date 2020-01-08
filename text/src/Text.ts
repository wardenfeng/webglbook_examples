namespace text
{

    const defaultDestroyOptions = {
        texture: true,
        children: false,
        baseTexture: true,
    };

    /**
     * A Text Object will create a line or multiple lines of text.
     *
     * The text is created using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
     *
     * The primary advantage of this class over BitmapText is that you have great control over the style of the next,
     * which you can change at runtime.
     *
     * The primary disadvantages is that each piece of text has it's own texture, which can use more memory.
     * When text changes, this texture has to be re-generated and re-uploaded to the GPU, taking up time.
     *
     * To split a line you can use '\n' in your text string, or, on the `style` object,
     * change its `wordWrap` property to true and and give the `wordWrapWidth` property a value.
     *
     * A Text can be created directly from a string and a style object,
     * which can be generated [here](https://pixijs.io/pixi-text-style).
     *
     * ```js
     * let text = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
     * ```
     */
    export class Text
    {
        /**
         * The canvas element that everything is drawn to
         */
        canvas: HTMLCanvasElement;

        /**
         * The canvas 2d context that everything is drawn with
         */
        context: CanvasRenderingContext2D;

        /**
         * The resolution / device pixel ratio of the canvas.
         * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
         */
        private _resolution = 1;
        private _autoResolution = true;

        /**
         * Private tracker for the current text.
         */
        private _text = "";

        /**
         * Private tracker for the current style.
         */
        private _style = new TextStyle();

        private localStyleID = -1;
        private dirty = true;

        /**
         * @param text - The string that you would like the text to display
         * @param style - The style parameters
         * @param canvas - The canvas element for drawing text
         */
        constructor(text: string, style: TextStyle, canvas: HTMLCanvasElement)
        {
            canvas = canvas || document.createElement('canvas');

            canvas.width = 3;
            canvas.height = 3;

            this.canvas = canvas;

            var context = this.canvas.getContext('2d');
            if (!context)
            {
                throw ``;
            }
            this.context = context;

            this.text = text;
            this.style = style;

        }

        /**
         * Renders text and updates it when needed.
         *
         * @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
         */
        updateText(respectDirty: boolean)
        {
            const style = this._style;

            // check if style has changed..
            if (this.localStyleID !== style.styleID)
            {
                this.dirty = true;
                this.localStyleID = style.styleID;
            }

            if (!this.dirty && respectDirty)
            {
                return;
            }

            drawText(this.canvas, this.text, style);

            this.dirty = false;
        }

        /**
         * Renders the object using the WebGL renderer
         *
         * @private
         * @param {PIXI.Renderer} renderer - The renderer
         */
        _render(renderer)
        {
            if (this._autoResolution && this._resolution !== renderer.resolution)
            {
                this._resolution = renderer.resolution;
                this.dirty = true;
            }

            this.updateText(true);
        }

        /**
         * Set the style of the text. Set up an event listener to listen for changes on the style
         * object and mark the text as dirty.
         *
         * @member {object|PIXI.TextStyle}
         */
        get style()
        {
            return this._style;
        }

        set style(style) // eslint-disable-line require-jsdoc
        {
            style = style || <any>{};

            if (style instanceof TextStyle)
            {
                this._style = style;
            }
            else
            {
                this._style = new TextStyle(style);
            }

            this.localStyleID = -1;
            this.dirty = true;
        }

        /**
         * Set the copy for the text object. To split a line you can use '\n'.
         *
         * @member {string}
         */
        get text()
        {
            return this._text;
        }

        set text(text) // eslint-disable-line require-jsdoc
        {
            text = String(text === null || text === undefined ? '' : text);

            if (this._text === text)
            {
                return;
            }
            this._text = text;
            this.dirty = true;
        }

        /**
         * The resolution / device pixel ratio of the canvas.
         * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
         * @member {number}
         * @default 1
         */
        get resolution()
        {
            return this._resolution;
        }

        set resolution(value) // eslint-disable-line require-jsdoc
        {
            this._autoResolution = false;

            if (this._resolution === value)
            {
                return;
            }

            this._resolution = value;
            this.dirty = true;
        }
    }

}