namespace text
{

    /**
     * Constants that define the type of gradient on text.
     */
    export enum TEXT_GRADIENT
    {
        /**
         * Vertical gradient
         */
        LINEAR_VERTICAL = 0,
        /**
         * Linear gradient
         */
        LINEAR_HORIZONTAL = 1,
    }

    const defaultStyle: Partial<TextStyle> = {
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

    const genericFontFamilies = [
        'serif',
        'sans-serif',
        'monospace',
        'cursive',
        'fantasy',
        'system-ui',
    ]

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
    export class TextStyle
    {
        styleID: number;

        private _align: 'left' | 'center' | 'right' = 'left';
        private _breakWords = false;
        private _dropShadow = false;
        private _dropShadowAlpha = 1;
        private _dropShadowAngle = Math.PI / 6;
        private _dropShadowBlur = 0;
        private _dropShadowColor: string | number = 'black';
        private _dropShadowDistance = 5;
        private _fill: string | number = 'black';
        private _fillGradientType = TEXT_GRADIENT.LINEAR_VERTICAL;
        private _fillGradientStops: number[] = [];
        private _fontFamily: string | string[] = 'Arial';
        private _fontSize = 26;
        private _fontStyle = 'normal';
        private _fontVariant = 'normal';
        private _fontWeight = 'normal';
        private _letterSpacing = 0;
        private _lineHeight = 0;
        private _lineJoin: CanvasLineJoin = 'miter';
        private _miterLimit = 10;
        private _padding = 0;
        private _stroke: string | CanvasGradient | CanvasPattern = 'black';
        private _strokeThickness = 0;
        private _textBaseline: CanvasTextBaseline = 'alphabetic';
        private _trim = false;
        private _whiteSpace = 'pre';
        private _wordWrap = false;
        private _wordWrapWidth = 100;
        private _leading = 0;

        /**
         * @param style - The style parameters
         */
        constructor(style?: Partial<TextStyle>)
        {
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
        clone()
        {
            const clonedProperties = {};

            deepCopyProperties(clonedProperties, this, defaultStyle);

            return new TextStyle(clonedProperties);
        }

        /**
         * Resets all properties to the defaults specified in TextStyle.prototype._default
         */
        reset()
        {
            deepCopyProperties(this, defaultStyle, defaultStyle);
        }

        /**
         * Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
         */
        get align()
        {
            return this._align;
        }
        set align(align)
        {
            if (this._align !== align)
            {
                this._align = align;
                this.styleID++;
            }
        }

        /**
         * Indicates if lines can be wrapped within words, it needs wordWrap to be set to true
         */
        get breakWords()
        {
            return this._breakWords;
        }
        set breakWords(breakWords)
        {
            if (this._breakWords !== breakWords)
            {
                this._breakWords = breakWords;
                this.styleID++;
            }
        }

        /**
         * Set a drop shadow for the text
         */
        get dropShadow()
        {
            return this._dropShadow;
        }
        set dropShadow(dropShadow)
        {
            if (this._dropShadow !== dropShadow)
            {
                this._dropShadow = dropShadow;
                this.styleID++;
            }
        }

        /**
         * Set alpha for the drop shadow
         */
        get dropShadowAlpha()
        {
            return this._dropShadowAlpha;
        }
        set dropShadowAlpha(dropShadowAlpha)
        {
            if (this._dropShadowAlpha !== dropShadowAlpha)
            {
                this._dropShadowAlpha = dropShadowAlpha;
                this.styleID++;
            }
        }

        /**
         * Set a angle of the drop shadow
         */
        get dropShadowAngle()
        {
            return this._dropShadowAngle;
        }
        set dropShadowAngle(dropShadowAngle)
        {
            if (this._dropShadowAngle !== dropShadowAngle)
            {
                this._dropShadowAngle = dropShadowAngle;
                this.styleID++;
            }
        }

        /**
         * Set a shadow blur radius
         */
        get dropShadowBlur()
        {
            return this._dropShadowBlur;
        }
        set dropShadowBlur(dropShadowBlur)
        {
            if (this._dropShadowBlur !== dropShadowBlur)
            {
                this._dropShadowBlur = dropShadowBlur;
                this.styleID++;
            }
        }

        /**
         * A fill style to be used on the dropshadow e.g 'red', '#00FF00'
         */
        get dropShadowColor()
        {
            return this._dropShadowColor;
        }
        set dropShadowColor(dropShadowColor)
        {
            const outputColor = getSingleColor(dropShadowColor);
            if (this._dropShadowColor !== outputColor)
            {
                this._dropShadowColor = outputColor;
                this.styleID++;
            }
        }

        /**
         * Set a distance of the drop shadow
         */
        get dropShadowDistance()
        {
            return this._dropShadowDistance;
        }
        set dropShadowDistance(dropShadowDistance)
        {
            if (this._dropShadowDistance !== dropShadowDistance)
            {
                this._dropShadowDistance = dropShadowDistance;
                this.styleID++;
            }
        }

        /**
         * A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'.
         * Can be an array to create a gradient eg ['#000000','#FFFFFF']
         * 
         * @see https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle
         */
        get fill()
        {
            return this._fill;
        }
        set fill(fill)
        {
            const outputColor = getSingleColor(fill);
            if (this._fill !== outputColor)
            {
                this._fill = outputColor;
                this.styleID++;
            }
        }

        /**
         * If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
         */
        get fillGradientType()
        {
            return this._fillGradientType;
        }
        set fillGradientType(fillGradientType)
        {
            if (this._fillGradientType !== fillGradientType)
            {
                this._fillGradientType = fillGradientType;
                this.styleID++;
            }
        }

        /**
         * If fill is an array of colours to create a gradient, this array can set the stop points
         * (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
         */
        get fillGradientStops()
        {
            return this._fillGradientStops;
        }
        set fillGradientStops(fillGradientStops)
        {
            if (!areArraysEqual(this._fillGradientStops, fillGradientStops))
            {
                this._fillGradientStops = fillGradientStops;
                this.styleID++;
            }
        }

        /**
         * The font family
         */
        get fontFamily()
        {
            return this._fontFamily;
        }
        set fontFamily(fontFamily)
        {
            if (this.fontFamily !== fontFamily)
            {
                this._fontFamily = fontFamily;
                this.styleID++;
            }
        }

        /**
         * The font size
         * (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
         */
        get fontSize()
        {
            return this._fontSize;
        }
        set fontSize(fontSize)
        {
            if (this._fontSize !== fontSize)
            {
                this._fontSize = fontSize;
                this.styleID++;
            }
        }

        /**
         * The font style
         * ('normal', 'italic' or 'oblique')
         */
        get fontStyle()
        {
            return this._fontStyle;
        }
        set fontStyle(fontStyle)
        {
            if (this._fontStyle !== fontStyle)
            {
                this._fontStyle = fontStyle;
                this.styleID++;
            }
        }

        /**
         * The font variant
         * ('normal' or 'small-caps')
         */
        get fontVariant()
        {
            return this._fontVariant;
        }
        set fontVariant(fontVariant)
        {
            if (this._fontVariant !== fontVariant)
            {
                this._fontVariant = fontVariant;
                this.styleID++;
            }
        }

        /**
         * The font weight
         * ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
         */
        get fontWeight()
        {
            return this._fontWeight;
        }
        set fontWeight(fontWeight)
        {
            if (this._fontWeight !== fontWeight)
            {
                this._fontWeight = fontWeight;
                this.styleID++;
            }
        }

        /**
         * The amount of spacing between letters, default is 0
         */
        get letterSpacing()
        {
            return this._letterSpacing;
        }
        set letterSpacing(letterSpacing)
        {
            if (this._letterSpacing !== letterSpacing)
            {
                this._letterSpacing = letterSpacing;
                this.styleID++;
            }
        }

        /**
         * The line height, a number that represents the vertical space that a letter uses
         */
        get lineHeight()
        {
            return this._lineHeight;
        }
        set lineHeight(lineHeight)
        {
            if (this._lineHeight !== lineHeight)
            {
                this._lineHeight = lineHeight;
                this.styleID++;
            }
        }

        /**
         * The space between lines
         */
        get leading()
        {
            return this._leading;
        }
        set leading(leading)
        {
            if (this._leading !== leading)
            {
                this._leading = leading;
                this.styleID++;
            }
        }

        /**
         * The lineJoin property sets the type of corner created, it can resolve spiked text issues.
         * Default is 'miter' (creates a sharp corner).
         */
        get lineJoin()
        {
            return this._lineJoin;
        }
        set lineJoin(lineJoin)
        {
            if (this._lineJoin !== lineJoin)
            {
                this._lineJoin = lineJoin;
                this.styleID++;
            }
        }

        /**
         * The miter limit to use when using the 'miter' lineJoin mode
         * This can reduce or increase the spikiness of rendered text.
         */
        get miterLimit()
        {
            return this._miterLimit;
        }
        set miterLimit(miterLimit)
        {
            if (this._miterLimit !== miterLimit)
            {
                this._miterLimit = miterLimit;
                this.styleID++;
            }
        }

        /**
         * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
         * by adding padding to all sides of the text.
         */
        get padding()
        {
            return this._padding;
        }
        set padding(padding)
        {
            if (this._padding !== padding)
            {
                this._padding = padding;
                this.styleID++;
            }
        }

        /**
         * A canvas fillstyle that will be used on the text stroke
         * e.g 'blue', '#FCFF00'
         */
        get stroke()
        {
            return this._stroke;
        }
        set stroke(stroke)
        {
            const outputColor = getSingleColor(<any>stroke);
            if (this._stroke !== outputColor)
            {
                this._stroke = outputColor;
                this.styleID++;
            }
        }

        /**
         * A number that represents the thickness of the stroke.
         * Default is 0 (no stroke)
         */
        get strokeThickness()
        {
            return this._strokeThickness;
        }
        set strokeThickness(strokeThickness)
        {
            if (this._strokeThickness !== strokeThickness)
            {
                this._strokeThickness = strokeThickness;
                this.styleID++;
            }
        }

        /**
         * The baseline of the text that is rendered.
         */
        get textBaseline()
        {
            return this._textBaseline;
        }
        set textBaseline(textBaseline)
        {
            if (this._textBaseline !== textBaseline)
            {
                this._textBaseline = textBaseline;
                this.styleID++;
            }
        }

        /**
         * Trim transparent borders
         */
        get trim()
        {
            return this._trim;
        }
        set trim(trim)
        {
            if (this._trim !== trim)
            {
                this._trim = trim;
                this.styleID++;
            }
        }

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
        get whiteSpace()
        {
            return this._whiteSpace;
        }
        set whiteSpace(whiteSpace)
        {
            if (this._whiteSpace !== whiteSpace)
            {
                this._whiteSpace = whiteSpace;
                this.styleID++;
            }
        }

        /**
         * Indicates if word wrap should be used
         */
        get wordWrap()
        {
            return this._wordWrap;
        }
        set wordWrap(wordWrap)
        {
            if (this._wordWrap !== wordWrap)
            {
                this._wordWrap = wordWrap;
                this.styleID++;
            }
        }

        /**
         * The width at which text will wrap, it needs wordWrap to be set to true
         */
        get wordWrapWidth()
        {
            return this._wordWrapWidth;
        }
        set wordWrapWidth(wordWrapWidth)
        {
            if (this._wordWrapWidth !== wordWrapWidth)
            {
                this._wordWrapWidth = wordWrapWidth;
                this.styleID++;
            }
        }

        /**
         * Generates a font style string to use for `TextMetrics.measureFont()`.
         *
         * @return Font style string, for passing to `TextMetrics.measureFont()`
         */
        toFontString()
        {
            // build canvas api font setting from individual components. Convert a numeric this.fontSize to px
            const fontSizeString = (typeof this.fontSize === 'number') ? `${this.fontSize}px` : this.fontSize;

            // Clean-up fontFamily property by quoting each font name
            // this will support font names with spaces
            let fontFamilies: string[] = <any>this.fontFamily;

            if (!Array.isArray(this.fontFamily))
            {
                fontFamilies = this.fontFamily.split(',');
            }

            for (let i = fontFamilies.length - 1; i >= 0; i--)
            {
                // Trim any extra white-space
                let fontFamily = fontFamilies[i].trim();

                // Check if font already contains strings
                if (!(/([\"\'])[^\'\"]+\1/).test(fontFamily) && genericFontFamilies.indexOf(fontFamily) < 0)
                {
                    fontFamily = `"${fontFamily}"`;
                }
                fontFamilies[i] = fontFamily;
            }

            return `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${fontSizeString} ${fontFamilies.join(',')}`;
        }
    }

    /**
     * Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
     * @param color
     * @return The color as a string.
     */
    function getSingleColor(color: string | number)
    {
        if (typeof color === 'number')
        {
            return hex2string(color);
        }
        else if (typeof color === 'string')
        {
            if (color.indexOf('0x') === 0)
            {
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
    function areArraysEqual(array1: any[], array2: any[])
    {
        if (!Array.isArray(array1) || !Array.isArray(array2))
        {
            return false;
        }

        if (array1.length !== array2.length)
        {
            return false;
        }

        for (let i = 0; i < array1.length; ++i)
        {
            if (array1[i] !== array2[i])
            {
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
    function deepCopyProperties(target: any, source: any, propertyObj?: Object)
    {
        for (const prop in propertyObj)
        {
            if (Array.isArray(source[prop]))
            {
                target[prop] = source[prop].slice();
            } else
            {
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
    function hex2string(hex: number): string
    {
        let hexString = hex.toString(16);

        hexString = '000000'.substr(0, 6 - hexString.length) + hexString;

        return `#${hexString}`;
    }
}