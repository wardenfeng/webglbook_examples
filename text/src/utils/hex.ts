namespace text
{

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
    export function hex2rgb(hex: number, out?: number[])
    {
        out = out || [];

        out[0] = ((hex >> 16) & 0xFF) / 255;
        out[1] = ((hex >> 8) & 0xFF) / 255;
        out[2] = (hex & 0xFF) / 255;

        return out;
    }

    /**
     * Converts a hexadecimal color number to a string.
     *
     * @example
     * PIXI.utils.hex2string(0xffffff); // returns "#ffffff"
     * 
     * @param hex - Number in hex (e.g., `0xffffff`)
     * @return The string color (e.g., `"#ffffff"`).
     */
    export function hex2string(hex: number)
    {
        let hexString = hex.toString(16);

        hexString = '000000'.substr(0, 6 - hexString.length) + hexString;

        return `#${hexString}`;
    }

    /**
     * Converts a hexadecimal string to a hexadecimal color number.
     *
     * @example
     * PIXI.utils.string2hex("#ffffff"); // returns 0xffffff
     * 
     * @param The string color (e.g., `"#ffffff"`)
     * @return Number in hexadecimal.
     */
    export function string2hex(string: string)
    {
        if (typeof string === 'string' && string[0] === '#')
        {
            string = string.substr(1);
        }

        return parseInt(string, 16);
    }

    /**
     * Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
     *
     * @example
     * PIXI.utils.rgb2hex([1, 1, 1]); // returns 0xffffff
     * 
     * @param rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
     * @return Number in hexadecimal.
     */
    export function rgb2hex(rgb: number[])
    {
        return (((rgb[0] * 255) << 16) + ((rgb[1] * 255) << 8) + (rgb[2] * 255 | 0));
    }
}