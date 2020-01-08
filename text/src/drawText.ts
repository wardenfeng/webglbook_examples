namespace text
{
    export function drawText(canvas: HTMLCanvasElement, _text: string, style: TextStyle, resolution = 1)
    {
        var _font = style.toFontString();

        const context = canvas.getContext('2d');
        const measured = TextMetrics.measureText(_text || ' ', style, style.wordWrap, canvas);
        const width = measured.width;
        const height = measured.height;
        const lines = measured.lines;
        const lineHeight = measured.lineHeight;
        const lineWidths = measured.lineWidths;
        const maxLineWidth = measured.maxLineWidth;
        const fontProperties = measured.fontProperties;

        canvas.width = Math.ceil((Math.max(1, width) + (style.padding * 2)) * resolution);
        canvas.height = Math.ceil((Math.max(1, height) + (style.padding * 2)) * resolution);

        context.scale(resolution, resolution);

        context.clearRect(0, 0, canvas.width, canvas.height);

        context.font = _font;
        context.lineWidth = style.strokeThickness;
        context.textBaseline = style.textBaseline;
        context.lineJoin = style.lineJoin;
        context.miterLimit = style.miterLimit;

        let linePositionX: number;
        let linePositionY: number;

        // require 2 passes if a shadow; the first to draw the drop shadow, the second to draw the text
        const passesCount = style.dropShadow ? 2 : 1;

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
        for (let i = 0; i < passesCount; ++i)
        {
            const isShadowPass = style.dropShadow && i === 0;
            const dsOffsetText = isShadowPass ? height * 2 : 0; // we only want the drop shadow, so put text way off-screen
            const dsOffsetShadow = dsOffsetText * resolution;

            if (isShadowPass)
            {
                // On Safari, text with gradient and drop shadows together do not position correctly
                // if the scale of the canvas is not 1: https://bugs.webkit.org/show_bug.cgi?id=197689
                // Therefore we'll set the styles to be a plain black whilst generating this drop shadow
                context.fillStyle = 'black';
                context.strokeStyle = 'black';

                const dropShadowColor = style.dropShadowColor;
                const rgb = hex2rgb(typeof dropShadowColor === 'number' ? dropShadowColor : string2hex(dropShadowColor));

                context.shadowColor = `rgba(${rgb[0] * 255},${rgb[1] * 255},${rgb[2] * 255},${style.dropShadowAlpha})`;
                context.shadowBlur = style.dropShadowBlur;
                context.shadowOffsetX = Math.cos(style.dropShadowAngle) * style.dropShadowDistance;
                context.shadowOffsetY = (Math.sin(style.dropShadowAngle) * style.dropShadowDistance) + dsOffsetShadow;
            }
            else
            {
                // set canvas text styles
                context.fillStyle = _generateFillStyle(canvas, style, lines, resolution);
                context.strokeStyle = style.stroke;

                context.shadowColor = "";
                context.shadowBlur = 0;
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
            }

            // draw lines line by line
            for (let i = 0; i < lines.length; i++)
            {
                linePositionX = style.strokeThickness / 2;
                linePositionY = ((style.strokeThickness / 2) + (i * lineHeight)) + fontProperties.ascent;

                if (style.align === 'right')
                {
                    linePositionX += maxLineWidth - lineWidths[i];
                }
                else if (style.align === 'center')
                {
                    linePositionX += (maxLineWidth - lineWidths[i]) / 2;
                }

                if (style.stroke && style.strokeThickness)
                {
                    drawLetterSpacing(
                        canvas,
                        style,
                        lines[i],
                        linePositionX + style.padding,
                        linePositionY + style.padding - dsOffsetText,
                        true
                    );
                }

                if (style.fill)
                {
                    drawLetterSpacing(
                        canvas,
                        style,
                        lines[i],
                        linePositionX + style.padding,
                        linePositionY + style.padding - dsOffsetText
                    );
                }
            }
        }

        if (style.trim)
        {
            const trimmed = trimCanvas(canvas);

            if (trimmed.data)
            {
                canvas.width = trimmed.width;
                canvas.height = trimmed.height;
                context.putImageData(trimmed.data, 0, 0);
            }
        }
    }

    /**
     * Generates the fill style. Can automatically generate a gradient based on the fill style being an array
     *
     * @param style - The style.
     * @param lines - The lines of text.
     * @return The fill style
     */
    function _generateFillStyle(canvas: HTMLCanvasElement, style: TextStyle, lines: string[], resolution = 1)
    {
        const context = canvas.getContext('2d');
        var stylefill = style.fill;
        if (!Array.isArray(stylefill))
        {
            return stylefill;
        }
        else if (stylefill.length === 1)
        {
            return stylefill[0];
        }

        // the gradient will be evenly spaced out according to how large the array is.
        // ['#FF0000', '#00FF00', '#0000FF'] would created stops at 0.25, 0.5 and 0.75
        let gradient: CanvasGradient;
        let totalIterations: number;
        let currentIteration: number;
        let stop: number;

        const width = Math.ceil(canvas.width / resolution);
        const height = Math.ceil(canvas.height / resolution);

        // make a copy of the style settings, so we can manipulate them later
        const fill: string[] = <any>stylefill.slice();
        const fillGradientStops = style.fillGradientStops.slice();

        // wanting to evenly distribute the fills. So an array of 4 colours should give fills of 0.25, 0.5 and 0.75
        if (!fillGradientStops.length)
        {
            const lengthPlus1 = fill.length + 1;

            for (let i = 1; i < lengthPlus1; ++i)
            {
                fillGradientStops.push(i / lengthPlus1);
            }
        }

        // stop the bleeding of the last gradient on the line above to the top gradient of the this line
        // by hard defining the first gradient colour at point 0, and last gradient colour at point 1
        fill.unshift(stylefill[0]);
        fillGradientStops.unshift(0);

        fill.push(stylefill[stylefill.length - 1]);
        fillGradientStops.push(1);

        if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL)
        {
            // start the gradient at the top center of the canvas, and end at the bottom middle of the canvas
            gradient = context.createLinearGradient(width / 2, 0, width / 2, height);

            // we need to repeat the gradient so that each individual line of text has the same vertical gradient effect
            // ['#FF0000', '#00FF00', '#0000FF'] over 2 lines would create stops at 0.125, 0.25, 0.375, 0.625, 0.75, 0.875
            totalIterations = (fill.length + 1) * lines.length;
            currentIteration = 0;
            for (let i = 0; i < lines.length; i++)
            {
                currentIteration += 1;
                for (let j = 0; j < fill.length; j++)
                {
                    if (typeof fillGradientStops[j] === 'number')
                    {
                        stop = (fillGradientStops[j] / lines.length) + (i / lines.length);
                    }
                    else
                    {
                        stop = currentIteration / totalIterations;
                    }
                    gradient.addColorStop(stop, fill[j]);
                    currentIteration++;
                }
            }
        }
        else
        {
            // start the gradient at the center left of the canvas, and end at the center right of the canvas
            gradient = context.createLinearGradient(0, height / 2, width, height / 2);

            // can just evenly space out the gradients in this case, as multiple lines makes no difference
            // to an even left to right gradient
            totalIterations = fill.length + 1;
            currentIteration = 1;

            for (let i = 0; i < fill.length; i++)
            {
                if (typeof fillGradientStops[i] === 'number')
                {
                    stop = fillGradientStops[i];
                }
                else
                {
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
    function drawLetterSpacing(canvas: HTMLCanvasElement, style: TextStyle, text: string, x: number, y: number, isStroke = false)
    {
        const context = canvas.getContext('2d');
        // letterSpacing of 0 means normal
        const letterSpacing = style.letterSpacing;

        if (letterSpacing === 0)
        {
            if (isStroke)
            {
                context.strokeText(text, x, y);
            }
            else
            {
                context.fillText(text, x, y);
            }

            return;
        }

        let currentPosition = x;

        // Using Array.from correctly splits characters whilst keeping emoji together.
        // This is not supported on IE as it requires ES6, so regular text splitting occurs.
        // This also doesn't account for emoji that are multiple emoji put together to make something else.
        // Handling all of this would require a big library itself.
        // https://medium.com/@giltayar/iterating-over-emoji-characters-the-es6-way-f06e4589516
        // https://github.com/orling/grapheme-splitter
        const stringArray = text.split('');
        let previousWidth = context.measureText(text).width;
        let currentWidth = 0;

        for (let i = 0; i < stringArray.length; ++i)
        {
            const currentChar = stringArray[i];

            if (isStroke)
            {
                context.strokeText(currentChar, currentPosition, y);
            }
            else
            {
                context.fillText(currentChar, currentPosition, y);
            }
            currentWidth = context.measureText(text.substring(i + 1)).width;
            currentPosition += previousWidth - currentWidth + letterSpacing;
            previousWidth = currentWidth;
        }
    }


}