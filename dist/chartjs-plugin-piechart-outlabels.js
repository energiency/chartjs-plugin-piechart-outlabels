/*!
 * chartjs-plugin-piechart-outlabels v0.1.3
 * http://www.chartjs.org
 * (c) 2017-2022 chartjs-plugin-piechart-outlabels contributors
 * Released under the MIT license
 */
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('chart.js')) :
typeof define === 'function' && define.amd ? define(['chart.js'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ChartPieChartOutlabels = factory(global.Chart));
})(this, (function (chart_js) { 'use strict';

/**
 * @module Options
 */

var defaults = {

  LABEL_KEY: '$outlabels',

  /**
	 * The color used to draw the background of the label rect.
	 * @member {String|Array|Function|null}
	 * @default null (adaptive background)
	 */
  backgroundColor: function(context) {
    return context.dataset.backgroundColor;
  },

  /**
	 * The color used to draw the border of the label rect.
	 * @member {String|Array|Function|null}
	 * @default null (adaptive border color)
	 */
  borderColor: function(context) {
    return context.dataset.backgroundColor;
  },

  /**
	 * The color used to draw the line between label and arc of the chart.
	 * @member {String|Array|Function|null}
	 * @default null (adaptive line color)
	 */
  lineColor: function(context) {
    return context.dataset.backgroundColor;
  },

  /**
	 * The border radius used to add rounded corners to the label rect.
	 * @member {Number|Array|Function}
	 * @default 0 (not rounded)
	 */
  borderRadius: 0,

  /**
	 * The border width of the surrounding frame.
	 * @member {Number|Array|Function}
	 * @default 0 (no border)
	 */
  borderWidth: 0,

  /**
	 * The width (thickness) of the line between label and chart arc.
	 * @member {Number|Array|Function}
	 * @default 2
	 */
  lineWidth: 2,

  /**
	 * The color used to draw the label text.
	 * @member {String|Array|Function}
	 * @default white
	 */
  color: 'white',

  /**
	 * Whether to display labels global (boolean) or per data (function)
	 * @member {Boolean|Array|Function}
	 * @default true
	 */
  display: true,

  /**
	 * The font options used to draw the label text.
	 * @member {Object|Array|Function}
	 * @prop {Boolean} font.family - defaults to Chart.defaults.global.defaultFontFamily
	 * @prop {Boolean} font.size - defaults to Chart.defaults.global.defaultFontSize
	 * @prop {Boolean} font.style - defaults to Chart.defaults.global.defaultFontStyle
	 * @prop {Boolean} font.weight - defaults to 'normal'
	 * @prop {Boolean} font.maxSize - defaults to undefined (unlimited)
	 * @prop {Boolean} font.minSize - defaults to undefined (unlimited)
	 * @prop {Boolean} font.resizable - defaults to true
	 * @default Chart.defaults.global.defaultFont.*
	 */
  font: {
    family: undefined,
    size: undefined,
    style: undefined,
    weight: null,
    maxSize: null,
    minSize: null,
    resizable: true,
  },

  /**
	 * The line height (in pixel) to use for multi-lines labels.
	 * @member {Number|Array|Function|undefined}
	 * @default 1.2
	 */
  lineHeight: 1.2,


  /**
	 * The padding (in pixels) to apply between the text and the surrounding frame.
	 * @member {Number|Object|Array|Function}
	 * @prop {Number} padding.top - Space above the text.
	 * @prop {Number} padding.right - Space on the right of the text.
	 * @prop {Number} padding.bottom - Space below the text.
	 * @prop {Number} padding.left - Space on the left of the text.
	 * @default 4 (all values)
	 */
  padding: {
    top: 4,
    right: 4,
    bottom: 4,
    left: 4
  },

  /**
	 * Text alignment for multi-lines labels ('left'|'right'|'start'|'center'|'end').
	 * @member {String|Array|Function}
	 * @default 'center'
	 */
  textAlign: 'center',

  /**
	 * The length of the line between label and chart arc.
	 * @member {Number|Array|Function|undefined}
	 * @default 40
	 */
  stretch: 40,

  /**
	 * The text of the label.
	 * @member {String}
	 * @default '%l %p' (label name and value percentage)
	 */
  text: '%l %p',

  /**
	 * The level of zoom (out) for pie/doughnut chart in percent.
	 * @member {Number}
	 * @default 50 (%)
	 */
  zoomOutPercentage: 50,

  /**
	 * The count of numbers after the point separator for float values of percent property
	 * @member {Number}
	 * @default 1
	 */
  percentPrecision: 1,

  /**
	 * The count of numbers after the point separator for float values of value property
	 * @member {Number}
	 * @default 3
	 */
  valuePrecision: 3
};

var outlabeledCharts = {
  init: function() {
    chart_js.defaults.outlabeledDoughnut = chart_js.defaults.doughnut;
    chart_js.defaults.outlabeledPie = chart_js.defaults.pie;

    class OutlabeledPie extends chart_js.PieController {
      update(reset) {
        super.update(reset);
        var meta = this.getMeta();
        var zoomOutPercentage = this.chart.options.zoomOutPercentage || defaults.zoomOutPercentage;

        this.outerRadius *= 1 - zoomOutPercentage / 100;
        this.innerRadius *= 1 - zoomOutPercentage / 100;

        this.updateElements(meta.data, 0, meta.data.length, 'resize');
      }
    }

    class OutlabeledDoughnut extends chart_js.DoughnutController {
      update(reset) {
        super.update(reset);
        var meta = this.getMeta();
        var zoomOutPercentage = this.chart.options.zoomOutPercentage || defaults.zoomOutPercentage;

        this.outerRadius *= 1 - zoomOutPercentage / 100;
        this.innerRadius *= 1 - zoomOutPercentage / 100;

        this.updateElements(meta.data, 0, meta.data.length, 'resize');
      }
    }

    OutlabeledPie.id = 'outlabeledPie';
    OutlabeledDoughnut.id = 'outlabeledDoughnut';

    chart_js.Chart.register(OutlabeledPie);
    chart_js.Chart.register(OutlabeledDoughnut);
  }
};

var positioners = {
  center: function(arc, stretch) {
    var angle = (arc.startAngle + arc.endAngle) / 2;
    var cosA = Math.cos(angle);
    var sinA = Math.sin(angle);
    var d = arc.outerRadius;

    var stretchedD = d + stretch;
    return {
      x: arc.x + cosA * stretchedD,
      y: arc.y + sinA * stretchedD,
      d: stretchedD,
      arc: arc,
      anchor: {
        x: arc.x + cosA * d,
        y: arc.y + sinA * d,
      },
      copy: {
        x: arc.x + cosA * stretchedD,
        y: arc.y + sinA * stretchedD
      }
    };
  },

  moveFromAnchor: function(center, dist) {
    var arc = center.arc;
    var d = center.d;
    var angle = (arc.startAngle + arc.endAngle) / 2;
    var cosA = Math.cos(angle);
    var sinA = Math.sin(angle);

    d += dist;

    return {
      x: arc.x + cosA * d,
      y: arc.y + sinA * d,
      d: d,
      arc: arc,
      anchor: center.anchor,
      copy: {
        x: arc.x + cosA * d,
        y: arc.y + sinA * d
      }
    };
  }
};

var helpers$2 = chart_js.Chart.helpers;
var LABEL_KEY$1 = defaults.LABEL_KEY;

var classes = {
  OutLabel: function(el, index, ctx, config, context) {
    var resolve = chart_js.Chart.helpers.resolve;
    // Check whether the label should be displayed
    if (!resolve([config.display, true], context, index)) {
      throw new Error('Label display property is set to false.');
    }
    // Init text
    var value = context.dataset.data[index];
    var label = context.labels[index];
    var text = resolve([config.text, defaults.text], context, index);

    /* Replace label marker */
    text = text.replace(/%l/gi, label);

    /* Replace value marker with possible precision value */
    (text.match(/%v\.?(\d*)/gi) || []).map(function(val) {
      var prec = val.replace(/%v\./gi, '');
      if (prec.length) {
        return +prec;
      }
      return config.valuePrecision || defaults.valuePrecision;
    }).forEach(function(val) {
      text = text.replace(/%v\.?(\d*)/i, value.toFixed(val));
    });

    /* Replace percent marker with possible precision value */
    (text.match(/%p\.?(\d*)/gi) || []).map(function(val) {
      var prec = val.replace(/%p\./gi, '');
      if (prec.length) {
        return +prec;
      }
      return config.percentPrecision || defaults.percentPrecision;
    }).forEach(function(val) {
      text = text.replace(/%p\.?(\d*)/i, (context.percent * 100).toFixed(val) + '%');
    });

    // Count lines
    var lines = text.match(/[^\r\n]+/g);

    // If no lines => nothng to display
    if (!lines || !lines.length) {
      throw new Error('No text to show.');
    }

    // Remove unnecessary spaces
    for (var i = 0; i < lines.length; ++i) {
      lines[i] = lines[i].trim();
    }

    /* ===================== CONSTRUCTOR ==================== */
    this.init = function(text, lines) {
      // If everything ok -> begin initializing
      this.encodedText = config.text;
      this.text = text;
      this.lines = lines;
      this.label = label;
      this.value = value;
      this.ctx = ctx;

      // Init style
      this.style = {
        backgroundColor: resolve([config.backgroundColor, defaults.backgroundColor, 'black'], context, index),
        borderColor: resolve([config.borderColor, defaults.borderColor, 'black'], context, index),
        borderRadius: resolve([config.borderRadius, 0], context, index),
        borderWidth: resolve([config.borderWidth, 0], context, index),
        lineWidth: resolve([config.lineWidth, 2], context, index),
        lineColor: resolve([config.lineColor, defaults.lineColor, 'black'], context, index),
        color: resolve([config.color, 'white'], context, index),
        font: helpers$2.parseFont(resolve([config.font, {resizable: true}]), ctx.canvas.style.height.slice(0, -2)),
        padding: helpers$2.toPadding(resolve([config.padding, 0], context, index)),
        textAlign: resolve([config.textAlign, 'left'], context, index),
      };

      this.stretch = resolve([config.stretch, 40], context, index);
      this.size = helpers$2.textSize(ctx, this.lines, this.style.font);

      this.offsetStep = this.size.width / 20;
      this.offset = {
        x: 0,
        y: 0
      };
      this.predictedOffset = this.offset;


      var angle = -((el.startAngle + el.endAngle) / 2) / (Math.PI);
      var val = Math.abs(angle - Math.trunc(angle));

      if (val > 0.45 && val < 0.55) {
        this.predictedOffset.x = 0;
      } else if (angle <= 0.45 && angle >= -0.45) {
        this.predictedOffset.x = this.size.width / 2;
      } else if (angle >= -1.45 && angle <= -0.55) {
        this.predictedOffset.x = -this.size.width / 2;
      }
    };

    this.init(text, lines);

    /* COMPUTING RECTS PART */
    this.computeLabelRect = function() {
      var width = this.textRect.width + 2 * this.style.borderWidth + this.style.padding.left * 2;
      var height = this.textRect.height + 2 * this.style.borderWidth;

      var x = this.textRect.x - this.style.borderWidth;
      var y = this.textRect.y - this.style.borderWidth;

      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    };
    const pad = 60;

    this.computeTextRect = function() {
      const shift = (this.center.x - this.center.copy.x < 0 ? -pad : pad);
      return {
        x: this.center.x - (this.size.width / 2) - this.style.padding.left + shift,
        y: this.center.y - (this.size.height / 2) - this.style.padding.top,
        width: this.size.width,
        height: this.size.height + this.style.padding.height
      };
    };

    this.getPoints = function() {
      return [
        {
          x: this.labelRect.x,
          y: this.labelRect.y
        },
        {
          x: this.labelRect.x + this.labelRect.width,
          y: this.labelRect.y
        },
        {
          x: this.labelRect.x + this.labelRect.width,
          y: this.labelRect.y + this.labelRect.height
        },
        {
          x: this.labelRect.x,
          y: this.labelRect.y + this.labelRect.height
        }
      ];
    };

    this.containsPoint = function(point, offset) {
      if (!offset) {
        offset = 5;
      }

      return	this.labelRect.x - offset <= point.x && point.x <= this.labelRect.x + this.labelRect.width + offset
							&&
						this.labelRect.y - offset <= point.y && point.y <= this.labelRect.y + this.labelRect.height + offset;
    };


    /* ======================= DRAWING ======================= */
    // Draw label text
    this.drawText = function() {
      var align = this.style.textAlign;
      var font = this.style.font;
      var lh = font.lineHeight;
      var color = this.style.color;
      var ilen = this.lines.length;
      var x, y, idx;

      if (!ilen || !color) {
        return;
      }

      x = this.textRect.x;
      y = this.textRect.y + lh / 2;

      if (align === 'center') {
        x += this.textRect.width / 2;
      } else if (align === 'end' || align === 'right') {
        x += this.textRect.width;
      }

      this.ctx.font = this.style.font.string;
      this.ctx.fillStyle = color;
      this.ctx.textAlign = align;
      this.ctx.textBaseline = 'middle';

      for (idx = 0; idx < ilen; ++idx) {
        this.ctx.fillText(
          this.lines[idx],
          Math.round(x) + this.style.padding.left,
          Math.round(y) + this.style.padding.top,
          Math.round(this.textRect.width)
        );
        y += lh;
      }
    };

    // Draw label box
    this.drawLabel = function() {
      ctx.beginPath();
      this.ctx.fillRect(
        this.ctx,
        Math.round(this.labelRect.x),
        Math.round(this.labelRect.y),
        Math.round(this.labelRect.width),
        Math.round(this.labelRect.height),
        this.style.borderRadius
      );
      this.ctx.closePath();

      if (this.style.backgroundColor) {
        this.ctx.fillStyle = this.style.backgroundColor || 'black';
        this.ctx.fill();
      }

      if (this.style.borderColor && this.style.borderWidth) {
        this.ctx.strokeStyle = this.style.borderColor;
        this.ctx.lineWidth = this.style.borderWidth;
        this.ctx.lineJoin = 'miter';
        this.ctx.stroke();
      }
    };

    this.ccw = function(A, B, C) {
      return (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
    };

    this.intersects = function(A, B, C, D) {
      return this.ccw(A, C, D) !== this.ccw(B, C, D) && this.ccw(A, B, C) !== this.ccw(A, B, D);
    };

    this.drawLine = function() {
      this.ctx.save();

      this.ctx.strokeStyle = this.style.lineColor;
      this.ctx.lineWidth = this.style.lineWidth;
      this.ctx.lineJoin = 'miter';
      this.ctx.beginPath();
      this.ctx.moveTo(this.center.anchor.x, this.center.anchor.y);
      this.ctx.lineTo(this.center.copy.x, this.center.copy.y);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(this.center.copy.x, this.center.copy.y);
      const xOffset = this.textRect.width + this.style.padding.width;
      const intersect = this.intersects(this.textRect, {
        x: this.textRect.x + this.textRect.width,
        y: this.textRect.y + this.textRect.height,
      }, this.center.copy, {
        x: this.textRect.x,
        y: this.textRect.y + this.textRect.height / 2
      });
      this.ctx.lineTo(this.textRect.x + (intersect ? xOffset : 0), this.textRect.y + this.textRect.height / 2);
      this.ctx.stroke();
      this.ctx.restore();
    };

    this.draw = function() {
      this.drawLabel();
      this.drawText();
    };


    this.update = function(view, elements, max) {
      this.center = positioners.center(view, this.stretch);
      this.moveLabelToOffset();

      this.center.x += this.offset.x;
      this.center.y += this.offset.y;

      var valid = false;

      while (!valid) {
        this.textRect = this.computeTextRect();
        this.labelRect = this.computeLabelRect();
        var rectPoints = this.getPoints();

        valid = true;

        for (var e = 0; e < max; ++e) {
          var element = elements[e][LABEL_KEY$1];
          if (!element) {
            continue;
          }

          var elPoints = element.getPoints();

          for (var p = 0; p < rectPoints.length; ++p) {
            if (element.containsPoint(rectPoints[p])) {
              valid = false;
              break;
            }

            if (this.containsPoint(elPoints[p])) {
              valid = false;
              break;
            }
          }
        }

        if (!valid) {
          this.center = positioners.moveFromAnchor(this.center, 1);
          this.center.x += this.offset.x;
          this.center.y += this.offset.y;
        }
      }
    };

    this.moveLabelToOffset = function() {
      if (this.predictedOffset.x <= 0 && this.offset.x > this.predictedOffset.x) {
        this.offset.x -= this.offsetStep;
        if (this.offset.x <= this.predictedOffset.x) {
          this.offset.x = this.predictedOffset.x;
        }
      } else if (this.predictedOffset.x >= 0 && this.offset.x < this.predictedOffset.x) {
        this.offset.x += this.offsetStep;
        if (this.offset.x >= this.predictedOffset.x) {
          this.offset.x = this.predictedOffset.x;
        }
      }
    };
  }
};

var helpers = chart_js.Chart.helpers;

var helpers$1 = helpers.merge(helpers, {
  // @todo move this method in Chart.helpers.canvas.toFont (deprecates helpers.fontString)
  // @see https://developer.mozilla.org/en-US/docs/Web/CSS/font
  toFontString: function(font) {
    if (!font || helpers.isNullOrUndef(font.size) || helpers.isNullOrUndef(font.family)) {
      return null;
    }

    return (font.style ? font.style + ' ' : '')
			+ (font.weight ? font.weight + ' ' : '')
			+ font.size + 'px '
			+ font.family;
  },

  // @todo move this in Chart.helpers.canvas.textSize
  // @todo cache calls of measureText if font doesn't change?!
  textSize: function(ctx, lines, font) {
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
      width: width
    };
  },

  // @todo move this method in Chart.helpers.options.toFont
  parseFont: function(value, height) {
    var global = chart_js.Chart.defaults;
    var size = helpers.valueOrDefault(value.size, global.defaultFontSize);

    if (value.resizable) {
      size = this.adaptTextSizeToHeight(height, value.minSize, value.maxSize);
    }

    var font = {
      family: helpers.valueOrDefault(value.family, global.defaultFontFamily),
      lineHeight: helpers.toLineHeight(value.lineHeight, size),
      size: size,
      style: helpers.valueOrDefault(value.style, global.defaultFontStyle),
      weight: helpers.valueOrDefault(value.weight, null),
      string: ''
    };

    font.string = helpers.toFontString(font);
    return font;
  },

  adaptTextSizeToHeight: function(height, min, max) {
    var size = (height / 100) * 2.5;
    if (min && size < min) {
      return min;
    }
    if (max && size > max) {
      return max;
    }
    return size;
  }
});

outlabeledCharts.init();
chart_js.defaults.plugins.outlabels = defaults;


var LABEL_KEY = defaults.LABEL_KEY;

function configure(dataset, options) {
  var override = dataset.outlabels;
  var config = {};

  if (override === false) {
    return null;
  }
  if (override === true) {
    override = {};
  }

  return helpers$1.merge(config, [options, override]);
}

var plugin = {
  id: 'outlabels',

  resize: function(chart) {
    chart.sizeChanged = true;
  },

  afterDatasetUpdate: function(chart, args, options) {
    var labels = chart.config.data.labels;
    var dataset = chart.data.datasets[args.index];
    var config = configure(dataset, options);
    var display = config && config.display;
    var elements = args.meta.data || [];
    var ctx = chart.ctx;
    var el, label, percent, newLabel, context, i;
    ctx.save();

    for (i = 0; i < elements.length; ++i) {
      el = elements[i];
      label = el[LABEL_KEY];
      percent = dataset.data[i] / args.meta.total;
      newLabel = null;

      if (display && el && !el.hidden) {
        try {
          context = {
            chart: chart,
            dataIndex: i,
            dataset: dataset,
            labels: labels,
            datasetIndex: args.index,
            percent: percent
          };
          newLabel = new classes.OutLabel(el, i, ctx, config, context);
        } catch (e) {
          newLabel = null;
        }
      }

      if (
        label && newLabel && !chart.sizeChanged &&
		(label.label === newLabel.label) && (label.encodedText === newLabel.encodedText)
      ) {
        newLabel.offset = label.offset;
      }

      el[LABEL_KEY] = newLabel;

    }

    ctx.restore();
    chart.sizeChanged = false;
  },
  afterDatasetDraw: function(chart, args) {
    var elements = args.meta.data || [];
    var ctx = chart.ctx;
    var el, label, index;

    for (var i = 0; i < 2 * elements.length; ++i) {
      index = i < elements.length ? i : i - elements.length;

      el = elements[index];
      label = el[LABEL_KEY];
      if (!label) {
        continue;
      }

      if (i < elements.length) {
        label.update(el, elements, i);
        label.drawLine(ctx);
      } else {
        label.draw(ctx);
      }
    }
  }
};

return plugin;

}));
