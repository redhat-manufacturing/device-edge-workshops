/**
 * TODO: When we move from string as a source of truth to data models
 * everything in this folder should probably be referred to as models vs types
 */
// If this number is a decimal, make it just five decimal places
// to avoid exponents
const sanitize = (v) => Math.round(v * 100000) / 100000;
const floatRegex = /(-)?([\d]*\.?[\d])+/g;
const colorRegex = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi;
const singleColorRegex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
function isString(v) {
    return typeof v === "string";
}

export { colorRegex, floatRegex, isString, sanitize, singleColorRegex };
