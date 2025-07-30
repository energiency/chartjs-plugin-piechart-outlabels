'use strict';

import { Chart } from 'chart.js';
import { valueOrDefault, isNullOrUndef, toLineHeight, toLineWidth } from 'chart.js/helpers';

function toFontString(font) {
    if (!font || isNullOrUndef(font.size) || isNullOrUndef(font.family)) {
        return null;
    }

    return (
        (font.style ? font.style + ' ' : '') + (font.weight ? font.weight + ' ' : '') + font.size + 'px ' + font.family
    );
}

function textSize(ctx, lines, font) {
    var items = [].concat(lines);
    var ilen = items.length;
    var prev = ctx.font;
    var width = 0;
    var i;

    ctx.font = font.string;

    for (i = 0; i < ilen; ++i) {
        width = Math.max(ctx.measureText(items[i]).width, width);
    }

    ctx.font = prev;

    return {
        height: ilen * font.lineHeight,
        width,
    };
}

function adaptTextSizeToHeight(width, height, minimum, maximum) {
    const diag = Math.sqrt(Math.pow(width || 100, 2) + Math.pow(height || 100, 2));
    const size = Math.round(diag * 0.02);

    if (minimum && size < minimum) {
        return minimum;
    }
    if (maximum && size > maximum) {
        return maximum;
    }
    return size;
}

function parseFont(value, width, height) {
    var size = valueOrDefault(value.size, Chart.defaults.defaultFontSize);

    if (value.resizable) {
        size = adaptTextSizeToHeight(width, height, value.minSize, value.maxSize);
    }

    var font = {
        family: valueOrDefault(value.family, Chart.defaults.defaultFontFamily),
        lineHeight: toLineHeight(value.lineHeight, size),
        lineWidth: toLineWidth(value.lineWidth, size),
        size,
        style: valueOrDefault(value.style, Chart.defaults.defaultFontStyle),
        weight: valueOrDefault(value.weight, null),
        string: '',
    };

    font.string = toFontString(font);
    return font;
}

export { textSize, parseFont };
