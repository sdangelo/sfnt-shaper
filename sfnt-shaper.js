/*
 * Copyright (C) 2017 Stefano D'Angelo <zanga.mail@gmail.com>
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

module.exports = {
	getGlyphs: function (text) {
		var ret = [];
		for (var i = 0; i < text.length; i++) {
			var cp = text.charCodeAt(i);
			if ((cp & 0xfb00) == 0xd800)
				cp = ((cp & 0x3ff) << 10)
				     | (text.charCodeAt(++i) & 0x3ff);
			ret.push(cp);
		}
		return ret;
	},

	layoutGlyphs: function (glyphs, metrics) {
		var ret = {
			advance:		0,
			glyphs:			[]
		};

		for (var i = 0; i < glyphs.length; i++) {
			var glyph = metrics.glyphs.find(
				function (glyph) {
					return glyphs[i] == glyph.charCode;
				});
			if (!glyph)
				glyph = metrics.glyphs[0];

			var g = {
				x:		ret.advance,
				advance:
					glyph.advanceWidth / metrics.unitsPerEm
			};
			ret.advance += g.advance;

			if (glyph.xMin) {
				g.xMin = g.x + glyph.xMin / metrics.unitsPerEm;
				g.xMax = g.x + glyph.xMax / metrics.unitsPerEm;
				g.yMin = glyph.yMin / metrics.unitsPerEm;
				g.yMax = glyph.yMax / metrics.unitsPerEm;

				if ("xMin" in ret) {
					ret.xMin = Math.min(ret.xMin, g.xMin);
					ret.xMax = Math.max(ret.xMax, g.xMax);
					ret.yMin = Math.min(ret.yMin, g.yMin);
					ret.yMax = Math.max(ret.yMax, g.yMax);
				} else {
					ret.xMin = g.xMin;
					ret.xMax = g.xMax;
					ret.yMin = g.yMin;
					ret.yMax = g.yMax;
				}
			}

			ret.glyphs.push(g);
		}

		return ret;
	}
};
