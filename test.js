#!/usr/bin/env node

var fs = require("fs");
var SFNTShaper = require("./sfnt-shaper.js");

var data = fs.readFileSync(process.argv[3], "utf8");
var metrics = JSON.parse(data);

var glyphs = SFNTShaper.getGlyphs(process.argv[2]);
var layout = SFNTShaper.layoutGlyphs(glyphs, metrics);

console.log(layout);
