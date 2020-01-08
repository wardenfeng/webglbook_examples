var text;
(function (text_1) {
    var defaultDestroyOptions = {
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
    var Text = /** @class */ (function () {
        /**
         * @param text - The string that you would like the text to display
         * @param style - The style parameters
         * @param canvas - The canvas element for drawing text
         */
        function Text(text, style, canvas) {
            /**
             * The resolution / device pixel ratio of the canvas.
             * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
             */
            this._resolution = 1;
            this._autoResolution = true;
            /**
             * Private tracker for the current text.
             */
            this._text = "";
            /**
             * Private tracker for the current style.
             */
            this._style = new text_1.TextStyle();
            this.localStyleID = -1;
            this.dirty = true;
            canvas = canvas || document.createElement('canvas');
            canvas.width = 3;
            canvas.height = 3;
            this.canvas = canvas;
            var context = this.canvas.getContext('2d');
            if (!context) {
                throw "";
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
        Text.prototype.updateText = function (respectDirty) {
            var style = this._style;
            // check if style has changed..
            if (this.localStyleID !== style.styleID) {
                this.dirty = true;
                this.localStyleID = style.styleID;
            }
            if (!this.dirty && respectDirty) {
                return;
            }
            text_1.drawText(this.canvas, this.text, style);
            this.dirty = false;
        };
        /**
         * Renders the object using the WebGL renderer
         *
         * @private
         * @param {PIXI.Renderer} renderer - The renderer
         */
        Text.prototype._render = function (renderer) {
            if (this._autoResolution && this._resolution !== renderer.resolution) {
                this._resolution = renderer.resolution;
                this.dirty = true;
            }
            this.updateText(true);
        };
        Object.defineProperty(Text.prototype, "style", {
            /**
             * Set the style of the text. Set up an event listener to listen for changes on the style
             * object and mark the text as dirty.
             *
             * @member {object|PIXI.TextStyle}
             */
            get: function () {
                return this._style;
            },
            set: function (style) {
                style = style || {};
                if (style instanceof text_1.TextStyle) {
                    this._style = style;
                }
                else {
                    this._style = new text_1.TextStyle(style);
                }
                this.localStyleID = -1;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "text", {
            /**
             * Set the copy for the text object. To split a line you can use '\n'.
             *
             * @member {string}
             */
            get: function () {
                return this._text;
            },
            set: function (text) {
                text = String(text === null || text === undefined ? '' : text);
                if (this._text === text) {
                    return;
                }
                this._text = text;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Text.prototype, "resolution", {
            /**
             * The resolution / device pixel ratio of the canvas.
             * This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
             * @member {number}
             * @default 1
             */
            get: function () {
                return this._resolution;
            },
            set: function (value) {
                this._autoResolution = false;
                if (this._resolution === value) {
                    return;
                }
                this._resolution = value;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        return Text;
    }());
    text_1.Text = Text;
})(text || (text = {}));
var text;
(function (text_2) {
    /**
     * The TextMetrics object represents the measurement of a block of text with a specified style.
     *
     * ```js
     * let style = new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'})
     * let textMetrics = PIXI.TextMetrics.measureText('Your text', style)
     * ```
     */
    var TextMetrics = /** @class */ (function () {
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
        function TextMetrics(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
            this.text = text;
            this.style = style;
            this.width = width;
            this.height = height;
            this.lines = lines;
            this.lineWidths = lineWidths;
            this.lineHeight = lineHeight;
            this.maxLineWidth = maxLineWidth;
            this.fontProperties = fontProperties;
        }
        /**
         * Measures the supplied string of text and returns a Rectangle.
         *
         * @param text - the text to measure.
         * @param style - the text style to use for measuring
         * @param wordWrap - optional override for if word-wrap should be applied to the text.
         * @param canvas - optional specification of the canvas to use for measuring.
         * @return measured width and height of the text.
         */
        TextMetrics.measureText = function (text, style, wordWrap, canvas) {
            if (canvas === void 0) { canvas = TextMetrics._canvas; }
            wordWrap = (wordWrap === undefined || wordWrap === null) ? style.wordWrap : wordWrap;
            var font = style.toFontString();
            var fontProperties = TextMetrics.measureFont(font);
            // fallback in case UA disallow canvas data extraction
            // (toDataURI, getImageData functions)
            if (fontProperties.fontSize === 0) {
                fontProperties.fontSize = style.fontSize;
                fontProperties.ascent = style.fontSize;
            }
            var context = canvas.getContext('2d');
            if (!context) {
                throw "\u83B7\u53D6 CanvasRenderingContext2D \u5931\u8D25\uFF01";
            }
            context.font = font;
            var outputText = wordWrap ? TextMetrics.wordWrap(text, style, canvas) : text;
            var lines = outputText.split(/(?:\r\n|\r|\n)/);
            var lineWidths = new Array(lines.length);
            var maxLineWidth = 0;
            for (var i = 0; i < lines.length; i++) {
                var lineWidth = context.measureText(lines[i]).width + ((lines[i].length - 1) * style.letterSpacing);
                lineWidths[i] = lineWidth;
                maxLineWidth = Math.max(maxLineWidth, lineWidth);
            }
            var width = maxLineWidth + style.strokeThickness;
            if (style.dropShadow) {
                width += style.dropShadowDistance;
            }
            var lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
            var height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness)
                + ((lines.length - 1) * (lineHeight + style.leading));
            if (style.dropShadow) {
                height += style.dropShadowDistance;
            }
            return new TextMetrics(text, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
        };
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
        TextMetrics.wordWrap = function (text, style, canvas) {
            if (canvas === void 0) { canvas = TextMetrics._canvas; }
            var context = canvas.getContext('2d');
            if (!context) {
                throw "\u83B7\u53D6 CanvasRenderingContext2D \u5931\u8D25\uFF01";
            }
            var width = 0;
            var line = '';
            var lines = '';
            var cache = {};
            var letterSpacing = style.letterSpacing, whiteSpace = style.whiteSpace;
            // How to handle whitespaces
            var collapseSpaces = TextMetrics.collapseSpaces(whiteSpace);
            var collapseNewlines = TextMetrics.collapseNewlines(whiteSpace);
            // whether or not spaces may be added to the beginning of lines
            var canPrependSpaces = !collapseSpaces;
            // There is letterSpacing after every char except the last one
            // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!
            // so for convenience the above needs to be compared to width + 1 extra letterSpace
            // t_h_i_s_' '_i_s_' '_a_n_' '_e_x_a_m_p_l_e_' '_!_
            // ________________________________________________
            // And then the final space is simply no appended to each line
            var wordWrapWidth = style.wordWrapWidth + letterSpacing;
            // break text into words, spaces and newline chars
            var tokens = TextMetrics.tokenize(text);
            for (var i = 0; i < tokens.length; i++) {
                // get the word, space or newlineChar
                var token = tokens[i];
                // if word is a new line
                if (TextMetrics.isNewline(token)) {
                    // keep the new line
                    if (!collapseNewlines) {
                        lines += TextMetrics.addLine(line);
                        canPrependSpaces = !collapseSpaces;
                        line = '';
                        width = 0;
                        continue;
                    }
                    // if we should collapse new lines
                    // we simply convert it into a space
                    token = ' ';
                }
                // if we should collapse repeated whitespaces
                if (collapseSpaces) {
                    // check both this and the last tokens for spaces
                    var currIsBreakingSpace = TextMetrics.isBreakingSpace(token);
                    var lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1]);
                    if (currIsBreakingSpace && lastIsBreakingSpace) {
                        continue;
                    }
                }
                // get word width from cache if possible
                var tokenWidth = TextMetrics.getFromCache(token, letterSpacing, cache, context);
                // word is longer than desired bounds
                if (tokenWidth > wordWrapWidth) {
                    // if we are not already at the beginning of a line
                    if (line !== '') {
                        // start newlines for overflow words
                        lines += TextMetrics.addLine(line);
                        line = '';
                        width = 0;
                    }
                    // break large word over multiple lines
                    if (TextMetrics.canBreakWords(token, style.breakWords)) {
                        // break word into characters
                        var characters = TextMetrics.wordWrapSplit(token);
                        // loop the characters
                        for (var j = 0; j < characters.length; j++) {
                            var char = characters[j];
                            var k = 1;
                            // we are not at the end of the token
                            while (characters[j + k]) {
                                var nextChar = characters[j + k];
                                var lastChar = char[char.length - 1];
                                // should not split chars
                                if (!TextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                                    // combine chars & move forward one
                                    char += nextChar;
                                }
                                else {
                                    break;
                                }
                                k++;
                            }
                            j += char.length - 1;
                            var characterWidth = TextMetrics.getFromCache(char, letterSpacing, cache, context);
                            if (characterWidth + width > wordWrapWidth) {
                                lines += TextMetrics.addLine(line);
                                canPrependSpaces = false;
                                line = '';
                                width = 0;
                            }
                            line += char;
                            width += characterWidth;
                        }
                    }
                    // run word out of the bounds
                    else {
                        // if there are words in this line already
                        // finish that line and start a new one
                        if (line.length > 0) {
                            lines += TextMetrics.addLine(line);
                            line = '';
                            width = 0;
                        }
                        var isLastToken = i === tokens.length - 1;
                        // give it its own line if it's not the end
                        lines += TextMetrics.addLine(token, !isLastToken);
                        canPrependSpaces = false;
                        line = '';
                        width = 0;
                    }
                }
                // word could fit
                else {
                    // word won't fit because of existing words
                    // start a new line
                    if (tokenWidth + width > wordWrapWidth) {
                        // if its a space we don't want it
                        canPrependSpaces = false;
                        // add a new line
                        lines += TextMetrics.addLine(line);
                        // start a new line
                        line = '';
                        width = 0;
                    }
                    // don't add spaces to the beginning of lines
                    if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
                        // add the word to the current line
                        line += token;
                        // update width counter
                        width += tokenWidth;
                    }
                }
            }
            lines += TextMetrics.addLine(line, false);
            return lines;
        };
        /**
         * Convienience function for logging each line added during the wordWrap
         * method
         *
         * @private
         * @param  line        - The line of text to add
         * @param  newLine     - Add new line character to end
         * @return A formatted line
         */
        TextMetrics.addLine = function (line, newLine) {
            if (newLine === void 0) { newLine = true; }
            line = TextMetrics.trimRight(line);
            line = (newLine) ? line + "\n" : line;
            return line;
        };
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
        TextMetrics.getFromCache = function (key, letterSpacing, cache, context) {
            var width = cache[key];
            if (width === undefined) {
                var spacing = ((key.length) * letterSpacing);
                width = context.measureText(key).width + spacing;
                cache[key] = width;
            }
            return width;
        };
        /**
         * Determines whether we should collapse breaking spaces
         *
         * @private
         * @param whiteSpace  The TextStyle property whiteSpace
         * @return should collapse
         */
        TextMetrics.collapseSpaces = function (whiteSpace) {
            return (whiteSpace === 'normal' || whiteSpace === 'pre-line');
        };
        /**
         * Determines whether we should collapse newLine chars
         *
         * @private
         * @param whiteSpace  The white space
         * @return should collapse
         */
        TextMetrics.collapseNewlines = function (whiteSpace) {
            return (whiteSpace === 'normal');
        };
        /**
         * trims breaking whitespaces from string
         *
         * @private
         * @param text  The text
         * @return trimmed string
         */
        TextMetrics.trimRight = function (text) {
            if (typeof text !== 'string') {
                return '';
            }
            for (var i = text.length - 1; i >= 0; i--) {
                var char = text[i];
                if (!TextMetrics.isBreakingSpace(char)) {
                    break;
                }
                text = text.slice(0, -1);
            }
            return text;
        };
        /**
         * Determines if char is a newline.
         *
         * @private
         * @param char  The character
         * @return True if newline, False otherwise.
         */
        TextMetrics.isNewline = function (char) {
            if (typeof char !== 'string') {
                return false;
            }
            return (TextMetrics._newlines.indexOf(char.charCodeAt(0)) >= 0);
        };
        /**
         * Determines if char is a breaking whitespace.
         *
         * @private
         * @param char  The character
         * @return True if whitespace, False otherwise.
         */
        TextMetrics.isBreakingSpace = function (char) {
            if (typeof char !== 'string') {
                return false;
            }
            return (TextMetrics._breakingSpaces.indexOf(char.charCodeAt(0)) >= 0);
        };
        /**
         * Splits a string into words, breaking-spaces and newLine characters
         *
         * @private
         * @param text       The text
         * @return A tokenized array
         */
        TextMetrics.tokenize = function (text) {
            var tokens = [];
            var token = '';
            if (typeof text !== 'string') {
                return tokens;
            }
            for (var i = 0; i < text.length; i++) {
                var char = text[i];
                if (TextMetrics.isBreakingSpace(char) || TextMetrics.isNewline(char)) {
                    if (token !== '') {
                        tokens.push(token);
                        token = '';
                    }
                    tokens.push(char);
                    continue;
                }
                token += char;
            }
            if (token !== '') {
                tokens.push(token);
            }
            return tokens;
        };
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
        TextMetrics.canBreakWords = function (token, breakWords) {
            return breakWords;
        };
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
        TextMetrics.canBreakChars = function (char, nextChar, token, index, breakWords) {
            return true;
        };
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
        TextMetrics.wordWrapSplit = function (token) {
            return token.split('');
        };
        /**
         * Calculates the ascent, descent and fontSize of a given font-style
         *
         * @param font - String representing the style of the font
         * @return Font properties object
         */
        TextMetrics.measureFont = function (font) {
            // as this method is used for preparing assets, don't recalculate things if we don't need to
            if (TextMetrics._fonts[font]) {
                return TextMetrics._fonts[font];
            }
            var properties = {};
            var canvas = TextMetrics._canvas;
            var context = TextMetrics._context;
            context.font = font;
            var metricsString = TextMetrics.METRICS_STRING + TextMetrics.BASELINE_SYMBOL;
            var width = Math.ceil(context.measureText(metricsString).width);
            var baseline = Math.ceil(context.measureText(TextMetrics.BASELINE_SYMBOL).width);
            var height = 2 * baseline;
            baseline = baseline * TextMetrics.BASELINE_MULTIPLIER | 0;
            canvas.width = width;
            canvas.height = height;
            context.fillStyle = '#f00';
            context.fillRect(0, 0, width, height);
            context.font = font;
            context.textBaseline = 'alphabetic';
            context.fillStyle = '#000';
            context.fillText(metricsString, 0, baseline);
            var imagedata = context.getImageData(0, 0, width, height).data;
            var pixels = imagedata.length;
            var line = width * 4;
            var i = 0;
            var idx = 0;
            var stop = false;
            // ascent. scan from top to bottom until we find a non red pixel
            for (i = 0; i < baseline; ++i) {
                for (var j = 0; j < line; j += 4) {
                    if (imagedata[idx + j] !== 255) {
                        stop = true;
                        break;
                    }
                }
                if (!stop) {
                    idx += line;
                }
                else {
                    break;
                }
            }
            properties.ascent = baseline - i;
            idx = pixels - line;
            stop = false;
            // descent. scan from bottom to top until we find a non red pixel
            for (i = height; i > baseline; --i) {
                for (var j = 0; j < line; j += 4) {
                    if (imagedata[idx + j] !== 255) {
                        stop = true;
                        break;
                    }
                }
                if (!stop) {
                    idx -= line;
                }
                else {
                    break;
                }
            }
            properties.descent = i - baseline;
            properties.fontSize = properties.ascent + properties.descent;
            TextMetrics._fonts[font] = properties;
            return properties;
        };
        /**
         * Clear font metrics in metrics cache.
         *
         * @param font - font name. If font name not set then clear cache for all fonts.
         */
        TextMetrics.clearMetrics = function (font) {
            if (font === void 0) { font = ''; }
            if (font) {
                delete TextMetrics._fonts[font];
            }
            else {
                TextMetrics._fonts = {};
            }
        };
        /**
         * Cached canvas element for measuring text
         */
        TextMetrics._canvas = (function () {
            var c = document.createElement('canvas');
            c.width = c.height = 10;
            return c;
        })();
        /**
         * Cache for context to use.
         */
        TextMetrics._context = TextMetrics._canvas.getContext('2d');
        /**
         * Cache of {@see PIXI.TextMetrics.FontMetrics} objects.
         */
        TextMetrics._fonts = {};
        /**
         * String used for calculate font metrics.
         * These characters are all tall to help calculate the height required for text.
         */
        TextMetrics.METRICS_STRING = '|ÉqÅ';
        /**
         * Baseline symbol for calculate font metrics.
         */
        TextMetrics.BASELINE_SYMBOL = 'M';
        /**
         * Baseline multiplier for calculate font metrics.
         */
        TextMetrics.BASELINE_MULTIPLIER = 1.4;
        /**
         * Cache of new line chars.
         */
        TextMetrics._newlines = [
            0x000A,
            0x000D,
        ];
        /**
         * Cache of breaking spaces.
         */
        TextMetrics._breakingSpaces = [
            0x0009,
            0x0020,
            0x2000,
            0x2001,
            0x2002,
            0x2003,
            0x2004,
            0x2005,
            0x2006,
            0x2008,
            0x2009,
            0x200A,
            0x205F,
            0x3000,
        ];
        return TextMetrics;
    }());
    text_2.TextMetrics = TextMetrics;
})(text || (text = {}));
var text;
(function (text) {
    /**
     * Constants that define the type of gradient on text.
     */
    var TEXT_GRADIENT;
    (function (TEXT_GRADIENT) {
        /**
         * Vertical gradient
         */
        TEXT_GRADIENT[TEXT_GRADIENT["LINEAR_VERTICAL"] = 0] = "LINEAR_VERTICAL";
        /**
         * Linear gradient
         */
        TEXT_GRADIENT[TEXT_GRADIENT["LINEAR_HORIZONTAL"] = 1] = "LINEAR_HORIZONTAL";
    })(TEXT_GRADIENT = text.TEXT_GRADIENT || (text.TEXT_GRADIENT = {}));
    var defaultStyle = {
        align: 'left',
        breakWords: false,
        dropShadow: false,
        dropShadowAlpha: 1,
        dropShadowAngle: Math.PI / 6,
        dropShadowBlur: 0,
        dropShadowColor: 'black',
        dropShadowDistance: 5,
        fill: 'black',
        fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
        fillGradientStops: [],
        fontFamily: 'Arial',
        fontSize: 26,
        fontStyle: 'normal',
        fontVariant: 'normal',
        fontWeight: 'normal',
        letterSpacing: 0,
        lineHeight: 0,
        lineJoin: 'miter',
        miterLimit: 10,
        padding: 0,
        stroke: 'black',
        strokeThickness: 0,
        textBaseline: 'alphabetic',
        trim: false,
        whiteSpace: 'pre',
        wordWrap: false,
        wordWrapWidth: 100,
        leading: 0,
    };
    var genericFontFamilies = [
        'serif',
        'sans-serif',
        'monospace',
        'cursive',
        'fantasy',
        'system-ui',
    ];
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
    var TextStyle = /** @class */ (function () {
        /**
         * @param style - The style parameters
         */
        function TextStyle(style) {
            this._align = 'left';
            this._breakWords = false;
            this._dropShadow = false;
            this._dropShadowAlpha = 1;
            this._dropShadowAngle = Math.PI / 6;
            this._dropShadowBlur = 0;
            this._dropShadowColor = 'black';
            this._dropShadowDistance = 5;
            this._fill = 'black';
            this._fillGradientType = TEXT_GRADIENT.LINEAR_VERTICAL;
            this._fillGradientStops = [];
            this._fontFamily = 'Arial';
            this._fontSize = 26;
            this._fontStyle = 'normal';
            this._fontVariant = 'normal';
            this._fontWeight = 'normal';
            this._letterSpacing = 0;
            this._lineHeight = 0;
            this._lineJoin = 'miter';
            this._miterLimit = 10;
            this._padding = 0;
            this._stroke = 'black';
            this._strokeThickness = 0;
            this._textBaseline = 'alphabetic';
            this._trim = false;
            this._whiteSpace = 'pre';
            this._wordWrap = false;
            this._wordWrapWidth = 100;
            this._leading = 0;
            this.styleID = 0;
            this.reset();
            deepCopyProperties(this, style, style);
        }
        /**
         * Creates a new TextStyle object with the same values as this one.
         * Note that the only the properties of the object are cloned.
         *
         * @return New cloned TextStyle object
         */
        TextStyle.prototype.clone = function () {
            var clonedProperties = {};
            deepCopyProperties(clonedProperties, this, defaultStyle);
            return new TextStyle(clonedProperties);
        };
        /**
         * Resets all properties to the defaults specified in TextStyle.prototype._default
         */
        TextStyle.prototype.reset = function () {
            deepCopyProperties(this, defaultStyle, defaultStyle);
        };
        Object.defineProperty(TextStyle.prototype, "align", {
            /**
             * Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
             */
            get: function () {
                return this._align;
            },
            set: function (align) {
                if (this._align !== align) {
                    this._align = align;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "breakWords", {
            /**
             * Indicates if lines can be wrapped within words, it needs wordWrap to be set to true
             */
            get: function () {
                return this._breakWords;
            },
            set: function (breakWords) {
                if (this._breakWords !== breakWords) {
                    this._breakWords = breakWords;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "dropShadow", {
            /**
             * Set a drop shadow for the text
             */
            get: function () {
                return this._dropShadow;
            },
            set: function (dropShadow) {
                if (this._dropShadow !== dropShadow) {
                    this._dropShadow = dropShadow;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "dropShadowAlpha", {
            /**
             * Set alpha for the drop shadow
             */
            get: function () {
                return this._dropShadowAlpha;
            },
            set: function (dropShadowAlpha) {
                if (this._dropShadowAlpha !== dropShadowAlpha) {
                    this._dropShadowAlpha = dropShadowAlpha;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "dropShadowAngle", {
            /**
             * Set a angle of the drop shadow
             */
            get: function () {
                return this._dropShadowAngle;
            },
            set: function (dropShadowAngle) {
                if (this._dropShadowAngle !== dropShadowAngle) {
                    this._dropShadowAngle = dropShadowAngle;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "dropShadowBlur", {
            /**
             * Set a shadow blur radius
             */
            get: function () {
                return this._dropShadowBlur;
            },
            set: function (dropShadowBlur) {
                if (this._dropShadowBlur !== dropShadowBlur) {
                    this._dropShadowBlur = dropShadowBlur;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "dropShadowColor", {
            /**
             * A fill style to be used on the dropshadow e.g 'red', '#00FF00'
             */
            get: function () {
                return this._dropShadowColor;
            },
            set: function (dropShadowColor) {
                var outputColor = getSingleColor(dropShadowColor);
                if (this._dropShadowColor !== outputColor) {
                    this._dropShadowColor = outputColor;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "dropShadowDistance", {
            /**
             * Set a distance of the drop shadow
             */
            get: function () {
                return this._dropShadowDistance;
            },
            set: function (dropShadowDistance) {
                if (this._dropShadowDistance !== dropShadowDistance) {
                    this._dropShadowDistance = dropShadowDistance;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "fill", {
            /**
             * A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'.
             * Can be an array to create a gradient eg ['#000000','#FFFFFF']
             *
             * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
             */
            get: function () {
                return this._fill;
            },
            set: function (fill) {
                var outputColor = getSingleColor(fill);
                if (this._fill !== outputColor) {
                    this._fill = outputColor;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "fillGradientType", {
            /**
             * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
             */
            get: function () {
                return this._fillGradientType;
            },
            set: function (fillGradientType) {
                if (this._fillGradientType !== fillGradientType) {
                    this._fillGradientType = fillGradientType;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "fillGradientStops", {
            /**
             * If fill is an array of colours to create a gradient, this array can set the stop points
             * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
             */
            get: function () {
                return this._fillGradientStops;
            },
            set: function (fillGradientStops) {
                if (!areArraysEqual(this._fillGradientStops, fillGradientStops)) {
                    this._fillGradientStops = fillGradientStops;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "fontFamily", {
            /**
             * The font family
             */
            get: function () {
                return this._fontFamily;
            },
            set: function (fontFamily) {
                if (this.fontFamily !== fontFamily) {
                    this._fontFamily = fontFamily;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "fontSize", {
            /**
             * The font size
             * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
             */
            get: function () {
                return this._fontSize;
            },
            set: function (fontSize) {
                if (this._fontSize !== fontSize) {
                    this._fontSize = fontSize;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "fontStyle", {
            /**
             * The font style
             * ('normal', 'italic' or 'oblique')
             */
            get: function () {
                return this._fontStyle;
            },
            set: function (fontStyle) {
                if (this._fontStyle !== fontStyle) {
                    this._fontStyle = fontStyle;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "fontVariant", {
            /**
             * The font variant
             * ('normal' or 'small-caps')
             */
            get: function () {
                return this._fontVariant;
            },
            set: function (fontVariant) {
                if (this._fontVariant !== fontVariant) {
                    this._fontVariant = fontVariant;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "fontWeight", {
            /**
             * The font weight
             * ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
             */
            get: function () {
                return this._fontWeight;
            },
            set: function (fontWeight) {
                if (this._fontWeight !== fontWeight) {
                    this._fontWeight = fontWeight;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "letterSpacing", {
            /**
             * The amount of spacing between letters, default is 0
             */
            get: function () {
                return this._letterSpacing;
            },
            set: function (letterSpacing) {
                if (this._letterSpacing !== letterSpacing) {
                    this._letterSpacing = letterSpacing;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "lineHeight", {
            /**
             * The line height, a number that represents the vertical space that a letter uses
             */
            get: function () {
                return this._lineHeight;
            },
            set: function (lineHeight) {
                if (this._lineHeight !== lineHeight) {
                    this._lineHeight = lineHeight;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "leading", {
            /**
             * The space between lines
             */
            get: function () {
                return this._leading;
            },
            set: function (leading) {
                if (this._leading !== leading) {
                    this._leading = leading;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "lineJoin", {
            /**
             * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
             * Default is 'miter' (creates a sharp corner).
             */
            get: function () {
                return this._lineJoin;
            },
            set: function (lineJoin) {
                if (this._lineJoin !== lineJoin) {
                    this._lineJoin = lineJoin;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "miterLimit", {
            /**
             * The miter limit to use when using the 'miter' lineJoin mode
             * This can reduce or increase the spikiness of rendered text.
             */
            get: function () {
                return this._miterLimit;
            },
            set: function (miterLimit) {
                if (this._miterLimit !== miterLimit) {
                    this._miterLimit = miterLimit;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "padding", {
            /**
             * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
             * by adding padding to all sides of the text.
             */
            get: function () {
                return this._padding;
            },
            set: function (padding) {
                if (this._padding !== padding) {
                    this._padding = padding;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "stroke", {
            /**
             * A canvas fillstyle that will be used on the text stroke
             * e.g 'blue', '#FCFF00'
             */
            get: function () {
                return this._stroke;
            },
            set: function (stroke) {
                var outputColor = getSingleColor(stroke);
                if (this._stroke !== outputColor) {
                    this._stroke = outputColor;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "strokeThickness", {
            /**
             * A number that represents the thickness of the stroke.
             * Default is 0 (no stroke)
             */
            get: function () {
                return this._strokeThickness;
            },
            set: function (strokeThickness) {
                if (this._strokeThickness !== strokeThickness) {
                    this._strokeThickness = strokeThickness;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "textBaseline", {
            /**
             * The baseline of the text that is rendered.
             */
            get: function () {
                return this._textBaseline;
            },
            set: function (textBaseline) {
                if (this._textBaseline !== textBaseline) {
                    this._textBaseline = textBaseline;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "trim", {
            /**
             * Trim transparent borders
             */
            get: function () {
                return this._trim;
            },
            set: function (trim) {
                if (this._trim !== trim) {
                    this._trim = trim;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "whiteSpace", {
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
            get: function () {
                return this._whiteSpace;
            },
            set: function (whiteSpace) {
                if (this._whiteSpace !== whiteSpace) {
                    this._whiteSpace = whiteSpace;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "wordWrap", {
            /**
             * Indicates if word wrap should be used
             */
            get: function () {
                return this._wordWrap;
            },
            set: function (wordWrap) {
                if (this._wordWrap !== wordWrap) {
                    this._wordWrap = wordWrap;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextStyle.prototype, "wordWrapWidth", {
            /**
             * The width at which text will wrap, it needs wordWrap to be set to true
             */
            get: function () {
                return this._wordWrapWidth;
            },
            set: function (wordWrapWidth) {
                if (this._wordWrapWidth !== wordWrapWidth) {
                    this._wordWrapWidth = wordWrapWidth;
                    this.styleID++;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Generates a font style string to use for `TextMetrics.measureFont()`.
         *
         * @return Font style string, for passing to `TextMetrics.measureFont()`
         */
        TextStyle.prototype.toFontString = function () {
            // build canvas api font setting from individual components. Convert a numeric this.fontSize to px
            var fontSizeString = (typeof this.fontSize === 'number') ? this.fontSize + "px" : this.fontSize;
            // Clean-up fontFamily property by quoting each font name
            // this will support font names with spaces
            var fontFamilies = this.fontFamily;
            if (!Array.isArray(this.fontFamily)) {
                fontFamilies = this.fontFamily.split(',');
            }
            for (var i = fontFamilies.length - 1; i >= 0; i--) {
                // Trim any extra white-space
                var fontFamily = fontFamilies[i].trim();
                // Check if font already contains strings
                if (!(/([\"\'])[^\'\"]+\1/).test(fontFamily) && genericFontFamilies.indexOf(fontFamily) < 0) {
                    fontFamily = "\"" + fontFamily + "\"";
                }
                fontFamilies[i] = fontFamily;
            }
            return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + fontSizeString + " " + fontFamilies.join(',');
        };
        return TextStyle;
    }());
    text.TextStyle = TextStyle;
    /**
     * Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
     * @param color
     * @return The color as a string.
     */
    function getSingleColor(color) {
        if (typeof color === 'number') {
            return hex2string(color);
        }
        else if (typeof color === 'string') {
            if (color.indexOf('0x') === 0) {
                color = color.replace('0x', '#');
            }
        }
        return color;
    }
    /**
     * Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
     * This version can also convert array of colors
     *
     * @param array1 First array to compare
     * @param array2 Second array to compare
     * @return Do the arrays contain the same values in the same order
     */
    function areArraysEqual(array1, array2) {
        if (!Array.isArray(array1) || !Array.isArray(array2)) {
            return false;
        }
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0; i < array1.length; ++i) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Utility function to ensure that object properties are copied by value, and not by reference
     *
     * @param target Target object to copy properties into
     * @param source Source object for the properties to copy
     * @param propertyObj Object containing properties names we want to loop over
     */
    function deepCopyProperties(target, source, propertyObj) {
        for (var prop in propertyObj) {
            if (Array.isArray(source[prop])) {
                target[prop] = source[prop].slice();
            }
            else {
                target[prop] = source[prop];
            }
        }
    }
    /**
     * Converts a hexadecimal color number to a string.
     *
     * @example
     * PIXI.utils.hex2string(0xffffff); // returns "#ffffff"
     */
    function hex2string(hex) {
        var hexString = hex.toString(16);
        hexString = '000000'.substr(0, 6 - hexString.length) + hexString;
        return "#" + hexString;
    }
})(text || (text = {}));
var text;
(function (text_3) {
    function drawText(canvas, _text, style, resolution) {
        if (resolution === void 0) { resolution = 1; }
        var _font = style.toFontString();
        var context = canvas.getContext('2d');
        var measured = text_3.TextMetrics.measureText(_text || ' ', style, style.wordWrap, canvas);
        var width = measured.width;
        var height = measured.height;
        var lines = measured.lines;
        var lineHeight = measured.lineHeight;
        var lineWidths = measured.lineWidths;
        var maxLineWidth = measured.maxLineWidth;
        var fontProperties = measured.fontProperties;
        canvas.width = Math.ceil((Math.max(1, width) + (style.padding * 2)) * resolution);
        canvas.height = Math.ceil((Math.max(1, height) + (style.padding * 2)) * resolution);
        context.scale(resolution, resolution);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = _font;
        context.lineWidth = style.strokeThickness;
        context.textBaseline = style.textBaseline;
        context.lineJoin = style.lineJoin;
        context.miterLimit = style.miterLimit;
        var linePositionX;
        var linePositionY;
        // require 2 passes if a shadow; the first to draw the drop shadow, the second to draw the text
        var passesCount = style.dropShadow ? 2 : 1;
        // For v4, we drew text at the colours of the drop shadow underneath the normal text. This gave the correct zIndex,
        // but features such as alpha and shadowblur did not look right at all, since we were using actual text as a shadow.
        //
        // For v5.0.0, we moved over to just use the canvas API for drop shadows, which made them look much nicer and more
        // visually please, but now because the stroke is drawn and then the fill, drop shadows would appear on both the fill
        // and the stroke; and fill drop shadows would appear over the top of the stroke.
        //
        // For v5.1.1, the new route is to revert to v4 style of drawing text first to get the drop shadows underneath normal
        // text, but instead drawing text in the correct location, we'll draw it off screen (-paddingY), and then adjust the
        // drop shadow so only that appears on screen (+paddingY). Now we'll have the correct draw order of the shadow
        // beneath the text, whilst also having the proper text shadow styling.
        for (var i = 0; i < passesCount; ++i) {
            var isShadowPass = style.dropShadow && i === 0;
            var dsOffsetText = isShadowPass ? height * 2 : 0; // we only want the drop shadow, so put text way off-screen
            var dsOffsetShadow = dsOffsetText * resolution;
            if (isShadowPass) {
                // On Safari, text with gradient and drop shadows together do not position correctly
                // if the scale of the canvas is not 1: https://bugs.webkit.org/show_bug.cgi?id=197689
                // Therefore we'll set the styles to be a plain black whilst generating this drop shadow
                context.fillStyle = 'black';
                context.strokeStyle = 'black';
                var dropShadowColor = style.dropShadowColor;
                var rgb = text_3.hex2rgb(typeof dropShadowColor === 'number' ? dropShadowColor : text_3.string2hex(dropShadowColor));
                context.shadowColor = "rgba(" + rgb[0] * 255 + "," + rgb[1] * 255 + "," + rgb[2] * 255 + "," + style.dropShadowAlpha + ")";
                context.shadowBlur = style.dropShadowBlur;
                context.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
                context.shadowOffsetY = (Math.sin(style.dropShadowAngle) * style.dropShadowDistance) + dsOffsetShadow;
            }
            else {
                // set canvas text styles
                context.fillStyle = _generateFillStyle(canvas, style, lines, resolution);
                context.strokeStyle = style.stroke;
                context.shadowColor = "";
                context.shadowBlur = 0;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
            }
            // draw lines line by line
            for (var i_1 = 0; i_1 < lines.length; i_1++) {
                linePositionX = style.strokeThickness / 2;
                linePositionY = ((style.strokeThickness / 2) + (i_1 * lineHeight)) + fontProperties.ascent;
                if (style.align === 'right') {
                    linePositionX += maxLineWidth - lineWidths[i_1];
                }
                else if (style.align === 'center') {
                    linePositionX += (maxLineWidth - lineWidths[i_1]) / 2;
                }
                if (style.stroke && style.strokeThickness) {
                    drawLetterSpacing(canvas, style, lines[i_1], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText, true);
                }
                if (style.fill) {
                    drawLetterSpacing(canvas, style, lines[i_1], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText);
                }
            }
        }
        if (style.trim) {
            var trimmed = text_3.trimCanvas(canvas);
            if (trimmed.data) {
                canvas.width = trimmed.width;
                canvas.height = trimmed.height;
                context.putImageData(trimmed.data, 0, 0);
            }
        }
    }
    text_3.drawText = drawText;
    /**
     * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
     *
     * @param style - The style.
     * @param lines - The lines of text.
     * @return The fill style
     */
    function _generateFillStyle(canvas, style, lines, resolution) {
        if (resolution === void 0) { resolution = 1; }
        var context = canvas.getContext('2d');
        var stylefill = style.fill;
        if (!Array.isArray(stylefill)) {
            return stylefill;
        }
        else if (stylefill.length === 1) {
            return stylefill[0];
        }
        // the gradient will be evenly spaced out according to how large the array is.
        // ['#FF0000', '#00FF00', '#0000FF'] would created stops at 0.25, 0.5 and 0.75
        var gradient;
        var totalIterations;
        var currentIteration;
        var stop;
        var width = Math.ceil(canvas.width / resolution);
        var height = Math.ceil(canvas.height / resolution);
        // make a copy of the style settings, so we can manipulate them later
        var fill = stylefill.slice();
        var fillGradientStops = style.fillGradientStops.slice();
        // wanting to evenly distribute the fills. So an array of 4 colours should give fills of 0.25, 0.5 and 0.75
        if (!fillGradientStops.length) {
            var lengthPlus1 = fill.length + 1;
            for (var i = 1; i < lengthPlus1; ++i) {
                fillGradientStops.push(i / lengthPlus1);
            }
        }
        // stop the bleeding of the last gradient on the line above to the top gradient of the this line
        // by hard defining the first gradient colour at point 0, and last gradient colour at point 1
        fill.unshift(stylefill[0]);
        fillGradientStops.unshift(0);
        fill.push(stylefill[stylefill.length - 1]);
        fillGradientStops.push(1);
        if (style.fillGradientType === text_3.TEXT_GRADIENT.LINEAR_VERTICAL) {
            // start the gradient at the top center of the canvas, and end at the bottom middle of the canvas
            gradient = context.createLinearGradient(width / 2, 0, width / 2, height);
            // we need to repeat the gradient so that each individual line of text has the same vertical gradient effect
            // ['#FF0000', '#00FF00', '#0000FF'] over 2 lines would create stops at 0.125, 0.25, 0.375, 0.625, 0.75, 0.875
            totalIterations = (fill.length + 1) * lines.length;
            currentIteration = 0;
            for (var i = 0; i < lines.length; i++) {
                currentIteration += 1;
                for (var j = 0; j < fill.length; j++) {
                    if (typeof fillGradientStops[j] === 'number') {
                        stop = (fillGradientStops[j] / lines.length) + (i / lines.length);
                    }
                    else {
                        stop = currentIteration / totalIterations;
                    }
                    gradient.addColorStop(stop, fill[j]);
                    currentIteration++;
                }
            }
        }
        else {
            // start the gradient at the center left of the canvas, and end at the center right of the canvas
            gradient = context.createLinearGradient(0, height / 2, width, height / 2);
            // can just evenly space out the gradients in this case, as multiple lines makes no difference
            // to an even left to right gradient
            totalIterations = fill.length + 1;
            currentIteration = 1;
            for (var i = 0; i < fill.length; i++) {
                if (typeof fillGradientStops[i] === 'number') {
                    stop = fillGradientStops[i];
                }
                else {
                    stop = currentIteration / totalIterations;
                }
                gradient.addColorStop(stop, fill[i]);
                currentIteration++;
            }
        }
        return gradient;
    }
    /**
     * Render the text with letter-spacing.
     * @param text The text to draw
     * @param x Horizontal position to draw the text
     * @param y Vertical position to draw the text
     * @param isStroke Is this drawing for the outside stroke of the
     *  text? If not, it's for the inside fill
     */
    function drawLetterSpacing(canvas, style, text, x, y, isStroke) {
        if (isStroke === void 0) { isStroke = false; }
        var context = canvas.getContext('2d');
        // letterSpacing of 0 means normal
        var letterSpacing = style.letterSpacing;
        if (letterSpacing === 0) {
            if (isStroke) {
                context.strokeText(text, x, y);
            }
            else {
                context.fillText(text, x, y);
            }
            return;
        }
        var currentPosition = x;
        // Using Array.from correctly splits characters whilst keeping emoji together.
        // This is not supported on IE as it requires ES6, so regular text splitting occurs.
        // This also doesn't account for emoji that are multiple emoji put together to make something else.
        // Handling all of this would require a big library itself.
        // https://medium.com/@giltayar/iterating-over-emoji-characters-the-es6-way-f06e4589516
        // https://github.com/orling/grapheme-splitter
        var stringArray = text.split('');
        var previousWidth = context.measureText(text).width;
        var currentWidth = 0;
        for (var i = 0; i < stringArray.length; ++i) {
            var currentChar = stringArray[i];
            if (isStroke) {
                context.strokeText(currentChar, currentPosition, y);
            }
            else {
                context.fillText(currentChar, currentPosition, y);
            }
            currentWidth = context.measureText(text.substring(i + 1)).width;
            currentPosition += previousWidth - currentWidth + letterSpacing;
            previousWidth = currentWidth;
        }
    }
})(text || (text = {}));
var text;
(function (text) {
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
    function hex2rgb(hex, out) {
        out = out || [];
        out[0] = ((hex >> 16) & 0xFF) / 255;
        out[1] = ((hex >> 8) & 0xFF) / 255;
        out[2] = (hex & 0xFF) / 255;
        return out;
    }
    text.hex2rgb = hex2rgb;
    /**
     * Converts a hexadecimal color number to a string.
     *
     * @example
     * PIXI.utils.hex2string(0xffffff); // returns "#ffffff"
     *
     * @param hex - Number in hex (e.g., `0xffffff`)
     * @return The string color (e.g., `"#ffffff"`).
     */
    function hex2string(hex) {
        var hexString = hex.toString(16);
        hexString = '000000'.substr(0, 6 - hexString.length) + hexString;
        return "#" + hexString;
    }
    text.hex2string = hex2string;
    /**
     * Converts a hexadecimal string to a hexadecimal color number.
     *
     * @example
     * PIXI.utils.string2hex("#ffffff"); // returns 0xffffff
     *
     * @param The string color (e.g., `"#ffffff"`)
     * @return Number in hexadecimal.
     */
    function string2hex(string) {
        if (typeof string === 'string' && string[0] === '#') {
            string = string.substr(1);
        }
        return parseInt(string, 16);
    }
    text.string2hex = string2hex;
    /**
     * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
     *
     * @example
     * PIXI.utils.rgb2hex([1, 1, 1]); // returns 0xffffff
     *
     * @param rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
     * @return Number in hexadecimal.
     */
    function rgb2hex(rgb) {
        return (((rgb[0] * 255) << 16) + ((rgb[1] * 255) << 8) + (rgb[2] * 255 | 0));
    }
    text.rgb2hex = rgb2hex;
})(text || (text = {}));
var text;
(function (text) {
    /**
     * Trim transparent borders from a canvas
     *
     * @param canvas - the canvas to trim
     */
    function trimCanvas(canvas) {
        // https://gist.github.com/remy/784508
        var width = canvas.width;
        var height = canvas.height;
        var context = canvas.getContext('2d');
        var imageData = context.getImageData(0, 0, width, height);
        var pixels = imageData.data;
        var len = pixels.length;
        var bound = {
            top: null,
            left: null,
            right: null,
            bottom: null,
        };
        var data = null;
        var i;
        var x;
        var y;
        for (i = 0; i < len; i += 4) {
            if (pixels[i + 3] !== 0) {
                x = (i / 4) % width;
                y = ~~((i / 4) / width);
                if (bound.top === null) {
                    bound.top = y;
                }
                if (bound.left === null) {
                    bound.left = x;
                }
                else if (x < bound.left) {
                    bound.left = x;
                }
                if (bound.right === null) {
                    bound.right = x + 1;
                }
                else if (bound.right < x) {
                    bound.right = x + 1;
                }
                if (bound.bottom === null) {
                    bound.bottom = y;
                }
                else if (bound.bottom < y) {
                    bound.bottom = y;
                }
            }
        }
        if (bound.top !== null) {
            width = bound.right - bound.left;
            height = bound.bottom - bound.top + 1;
            data = context.getImageData(bound.left, bound.top, width, height);
        }
        return {
            height: height,
            width: width,
            data: data,
        };
    }
    text.trimCanvas = trimCanvas;
})(text || (text = {}));
//# sourceMappingURL=text.js.map