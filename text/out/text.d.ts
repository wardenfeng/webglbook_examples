declare namespace text {
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
    class Text {
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
        private _resolution;
        private _autoResolution;
        /**
         * Private tracker for the current text.
         */
        private _text;
        /**
         * Private tracker for the current style.
         */
        private _style;
        private localStyleID;
        private dirty;
        /**
         * @param text - The string that you would like the text to display
         * @param style - The style parameters
         * @param canvas - The canvas element for drawing text
         */
        constructor(text: string, style: TextStyle, canvas: HTMLCanvasElement);
        /**
         * Renders text and updates it when needed.
         *
         * @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
         */
        updateText(respectDirty: boolean): void;
        /**
         * Renders the object using the WebGL renderer
         *
         * @private
         * @param {PIXI.Renderer} renderer - The renderer
         */
        _render(renderer: any): void;
        /**
         * Set the style of the text. Set up an event listener to listen for changes on the style
         * object and mark the text as dirty.
         *
         * @member {object|PIXI.TextStyle}
         */
        style: TextStyle;
        /**
         * Set the copy for the text object. To split a line you can use '\n'.
         *
         * @member {string}
         */
        text: string;
        /**
         * The resolution / device pixel ratio of the canvas.
         * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
         * @member {number}
         * @default 1
         */
        resolution: number;
    }
}
declare namespace text {
    /**
     * The TextMetrics object represents the measurement of a block of text with a specified style.
     *
     * ```js
     * let style = new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'})
     * let textMetrics = PIXI.TextMetrics.measureText('Your text', style)
     * ```
     */
    class TextMetrics {
        /**
         * The text that was measured
         *
         */
        text: string;
        /**
         * The style that was measured
         */
        style: TextStyle;
        /**
         * The measured width of the text
         */
        width: number;
        /**
         * The measured height of the text
         */
        height: number;
        /**
         * An array of lines of the text broken by new lines and wrapping is specified in style
         */
        lines: string[];
        /**
         * An array of the line widths for each line matched to `lines`
         */
        lineWidths: number[];
        /**
         * The measured line height for this style
         */
        lineHeight: number;
        /**
         * The maximum line width for all measured lines
         */
        maxLineWidth: number;
        /**
         * The font properties object from TextMetrics.measureFont
         */
        fontProperties: IFontMetrics;
        /**
         * Cached canvas element for measuring text
         */
        static _canvas: HTMLCanvasElement;
        /**
         * Cache for context to use.
         */
        static _context: CanvasRenderingContext2D;
        /**
         * Cache of {@see PIXI.TextMetrics.FontMetrics} objects.
         */
        static _fonts: {
            [key: string]: IFontMetrics;
        };
        /**
         * String used for calculate font metrics.
         * These characters are all tall to help calculate the height required for text.
         */
        static METRICS_STRING: string;
        /**
         * Baseline symbol for calculate font metrics.
         */
        static BASELINE_SYMBOL: string;
        /**
         * Baseline multiplier for calculate font metrics.
         */
        static BASELINE_MULTIPLIER: number;
        /**
         * Cache of new line chars.
         */
        static _newlines: number[];
        /**
         * Cache of breaking spaces.
         */
        static _breakingSpaces: number[];
        /**
         * @param text - the text that was measured
         * @param style - the style that was measured
         * @param width - the measured width of the text
         * @param height - the measured height of the text
         * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
         * @param lineWidths - an array of the line widths for each line matched to `lines`
         * @param lineHeight - the measured line height for this style
         * @param maxLineWidth - the maximum line width for all measured lines
         * @param fontProperties - the font properties object from TextMetrics.measureFont
         */
        constructor(text: string, style: TextStyle, width: number, height: number, lines: string[], lineWidths: number[], lineHeight: number, maxLineWidth: number, fontProperties: IFontMetrics);
        /**
         * Measures the supplied string of text and returns a Rectangle.
         *
         * @param text - the text to measure.
         * @param style - the text style to use for measuring
         * @param wordWrap - optional override for if word-wrap should be applied to the text.
         * @param canvas - optional specification of the canvas to use for measuring.
         * @return measured width and height of the text.
         */
        static measureText(text: string, style: TextStyle, wordWrap: boolean, canvas?: HTMLCanvasElement): TextMetrics;
        /**
         * Applies newlines to a string to have it optimally fit into the horizontal
         * bounds set by the Text object's wordWrapWidth property.
         *
         * @private
         * @param text - String to apply word wrapping to
         * @param style - the style to use when wrapping
         * @param canvas - optional specification of the canvas to use for measuring.
         * @return New string with new lines applied where required
         */
        static wordWrap(text: string, style: TextStyle, canvas?: HTMLCanvasElement): string;
        /**
         * Convienience function for logging each line added during the wordWrap
         * method
         *
         * @private
         * @param  line        - The line of text to add
         * @param  newLine     - Add new line character to end
         * @return A formatted line
         */
        static addLine(line: string, newLine?: boolean): string;
        /**
         * Gets & sets the widths of calculated characters in a cache object
         *
         * @private
         * @param key            The key
         * @param letterSpacing  The letter spacing
         * @param cache          The cache
         * @param context        The canvas context
         * @return The from cache.
         */
        static getFromCache(key: string, letterSpacing: number, cache: {
            [key: string]: number;
        }, context: CanvasRenderingContext2D): number;
        /**
         * Determines whether we should collapse breaking spaces
         *
         * @private
         * @param whiteSpace  The TextStyle property whiteSpace
         * @return should collapse
         */
        static collapseSpaces(whiteSpace: string): boolean;
        /**
         * Determines whether we should collapse newLine chars
         *
         * @private
         * @param whiteSpace  The white space
         * @return should collapse
         */
        static collapseNewlines(whiteSpace: string): boolean;
        /**
         * trims breaking whitespaces from string
         *
         * @private
         * @param text  The text
         * @return trimmed string
         */
        static trimRight(text: string): string;
        /**
         * Determines if char is a newline.
         *
         * @private
         * @param char  The character
         * @return True if newline, False otherwise.
         */
        static isNewline(char: string): boolean;
        /**
         * Determines if char is a breaking whitespace.
         *
         * @private
         * @param char  The character
         * @return True if whitespace, False otherwise.
         */
        static isBreakingSpace(char: string): boolean;
        /**
         * Splits a string into words, breaking-spaces and newLine characters
         *
         * @private
         * @param text       The text
         * @return A tokenized array
         */
        static tokenize(text: string): string[];
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It allows one to customise which words should break
         * Examples are if the token is CJK or numbers.
         * It must return a boolean.
         *
         * @param token       The token
         * @param breakWords  The style attr break words
         * @return whether to break word or not
         */
        static canBreakWords(token: string, breakWords: boolean): boolean;
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It allows one to determine whether a pair of characters
         * should be broken by newlines
         * For example certain characters in CJK langs or numbers.
         * It must return a boolean.
         *
         * @param char      The character
         * @param nextChar  The next character
         * @param token     The token/word the characters are from
         * @param index     The index in the token of the char
         * @param breakWords  The style attr break words
         * @return whether to break word or not
         */
        static canBreakChars(char: string, nextChar: string, token: string, index: number, breakWords: boolean): boolean;
        /**
         * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
         *
         * It is called when a token (usually a word) has to be split into separate pieces
         * in order to determine the point to break a word.
         * It must return an array of characters.
         *
         * @example
         * // Correctly splits emojis, eg "🤪🤪" will result in two element array, each with one emoji.
         * TextMetrics.wordWrapSplit = (token) => [...token];
         *
         * @param token The token to split
         * @return The characters of the token
         */
        static wordWrapSplit(token: string): string[];
        /**
         * Calculates the ascent, descent and fontSize of a given font-style
         *
         * @param font - String representing the style of the font
         * @return Font properties object
         */
        static measureFont(font: string): IFontMetrics;
        /**
         * Clear font metrics in metrics cache.
         *
         * @param font - font name. If font name not set then clear cache for all fonts.
         */
        static clearMetrics(font?: string): void;
    }
    /**
     * A number, or a string containing a number.
     */
    interface IFontMetrics {
        /**
         * Font ascent
         */
        ascent: number;
        /**
         * Font descent
         */
        descent: number;
        /**
         * Font size
         */
        fontSize: number;
    }
}
declare namespace text {
    /**
     * Constants that define the type of gradient on text.
     */
    enum TEXT_GRADIENT {
        /**
         * Vertical gradient
         */
        LINEAR_VERTICAL = 0,
        /**
         * Linear gradient
         */
        LINEAR_HORIZONTAL = 1
    }
    /**
     * A TextStyle Object contains information to decorate a Text objects.
     *
     * An instance can be shared between multiple Text objects; then changing the style will update all text objects using it.
     *
     * A tool can be used to generate a text style [here](https://pixijs.io/pixi-text-style).
     *
     * @class
     * @memberof PIXI
     */
    class TextStyle {
        styleID: number;
        private _align;
        private _breakWords;
        private _dropShadow;
        private _dropShadowAlpha;
        private _dropShadowAngle;
        private _dropShadowBlur;
        private _dropShadowColor;
        private _dropShadowDistance;
        private _fill;
        private _fillGradientType;
        private _fillGradientStops;
        private _fontFamily;
        private _fontSize;
        private _fontStyle;
        private _fontVariant;
        private _fontWeight;
        private _letterSpacing;
        private _lineHeight;
        private _lineJoin;
        private _miterLimit;
        private _padding;
        private _stroke;
        private _strokeThickness;
        private _textBaseline;
        private _trim;
        private _whiteSpace;
        private _wordWrap;
        private _wordWrapWidth;
        private _leading;
        /**
         * @param style - The style parameters
         */
        constructor(style?: Partial<TextStyle>);
        /**
         * Creates a new TextStyle object with the same values as this one.
         * Note that the only the properties of the object are cloned.
         *
         * @return New cloned TextStyle object
         */
        clone(): TextStyle;
        /**
         * Resets all properties to the defaults specified in TextStyle.prototype._default
         */
        reset(): void;
        /**
         * Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
         */
        align: "left" | "right" | "center";
        /**
         * Indicates if lines can be wrapped within words, it needs wordWrap to be set to true
         */
        breakWords: boolean;
        /**
         * Set a drop shadow for the text
         */
        dropShadow: boolean;
        /**
         * Set alpha for the drop shadow
         */
        dropShadowAlpha: number;
        /**
         * Set a angle of the drop shadow
         */
        dropShadowAngle: number;
        /**
         * Set a shadow blur radius
         */
        dropShadowBlur: number;
        /**
         * A fill style to be used on the dropshadow e.g 'red', '#00FF00'
         */
        dropShadowColor: string | number;
        /**
         * Set a distance of the drop shadow
         */
        dropShadowDistance: number;
        /**
         * A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'.
         * Can be an array to create a gradient eg ['#000000','#FFFFFF']
         *
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
         */
        fill: string | number;
        /**
         * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
         */
        fillGradientType: TEXT_GRADIENT;
        /**
         * If fill is an array of colours to create a gradient, this array can set the stop points
         * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
         */
        fillGradientStops: number[];
        /**
         * The font family
         */
        fontFamily: string | string[];
        /**
         * The font size
         * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
         */
        fontSize: number;
        /**
         * The font style
         * ('normal', 'italic' or 'oblique')
         */
        fontStyle: string;
        /**
         * The font variant
         * ('normal' or 'small-caps')
         */
        fontVariant: string;
        /**
         * The font weight
         * ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
         */
        fontWeight: string;
        /**
         * The amount of spacing between letters, default is 0
         */
        letterSpacing: number;
        /**
         * The line height, a number that represents the vertical space that a letter uses
         */
        lineHeight: number;
        /**
         * The space between lines
         */
        leading: number;
        /**
         * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
         * Default is 'miter' (creates a sharp corner).
         */
        lineJoin: CanvasLineJoin;
        /**
         * The miter limit to use when using the 'miter' lineJoin mode
         * This can reduce or increase the spikiness of rendered text.
         */
        miterLimit: number;
        /**
         * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
         * by adding padding to all sides of the text.
         */
        padding: number;
        /**
         * A canvas fillstyle that will be used on the text stroke
         * e.g 'blue', '#FCFF00'
         */
        stroke: string | CanvasGradient | CanvasPattern;
        /**
         * A number that represents the thickness of the stroke.
         * Default is 0 (no stroke)
         */
        strokeThickness: number;
        /**
         * The baseline of the text that is rendered.
         */
        textBaseline: CanvasTextBaseline;
        /**
         * Trim transparent borders
         */
        trim: boolean;
        /**
         * How newlines and spaces should be handled.
         * Default is 'pre' (preserve, preserve).
         *
         *  value       | New lines     |   Spaces
         *  ---         | ---           |   ---
         * 'normal'     | Collapse      |   Collapse
         * 'pre'        | Preserve      |   Preserve
         * 'pre-line'   | Preserve      |   Collapse
         */
        whiteSpace: string;
        /**
         * Indicates if word wrap should be used
         */
        wordWrap: boolean;
        /**
         * The width at which text will wrap, it needs wordWrap to be set to true
         */
        wordWrapWidth: number;
        /**
         * Generates a font style string to use for `TextMetrics.measureFont()`.
         *
         * @return Font style string, for passing to `TextMetrics.measureFont()`
         */
        toFontString(): string;
    }
}
declare namespace text {
    function drawText(canvas: HTMLCanvasElement, _text: string, style: TextStyle, resolution?: number): void;
}
declare namespace text {
    /**
     * Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
     *
     * @example
     * PIXI.utils.hex2rgb(0xffffff); // returns [1, 1, 1]
     *
     * @param hex - The hexadecimal number to convert
     * @param out If supplied, this array will be used rather than returning a new one
     * @return An array representing the [R, G, B] of the color where all values are floats.
     */
    function hex2rgb(hex: number, out?: number[]): number[];
    /**
     * Converts a hexadecimal color number to a string.
     *
     * @example
     * PIXI.utils.hex2string(0xffffff); // returns "#ffffff"
     *
     * @param hex - Number in hex (e.g., `0xffffff`)
     * @return The string color (e.g., `"#ffffff"`).
     */
    function hex2string(hex: number): string;
    /**
     * Converts a hexadecimal string to a hexadecimal color number.
     *
     * @example
     * PIXI.utils.string2hex("#ffffff"); // returns 0xffffff
     *
     * @param The string color (e.g., `"#ffffff"`)
     * @return Number in hexadecimal.
     */
    function string2hex(string: string): number;
    /**
     * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
     *
     * @example
     * PIXI.utils.rgb2hex([1, 1, 1]); // returns 0xffffff
     *
     * @param rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
     * @return Number in hexadecimal.
     */
    function rgb2hex(rgb: number[]): number;
}
declare namespace text {
    /**
     * Trim transparent borders from a canvas
     *
     * @param canvas - the canvas to trim
     */
    function trimCanvas(canvas: HTMLCanvasElement): {
        height: number;
        width: number;
        data: any;
    };
}
