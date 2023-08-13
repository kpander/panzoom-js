/**
 * Create ./dist/ versions.
 */

const pjson = require("./package.json");
const uglify = require("uglify-js");
const build = require("./build/Build")(pjson, uglify);

build.processFile("src/PanZoom.js", "dist/PanZoom.js");
build.processFile("src/PanZoom.UI.Drag.js", "dist/PanZoom.UI.Drag.js");

