/**
 * Create ./dist/ versions.
 */

const packager = require("@kpander/packager-js");

packager.setPackageJson(require("./package.json"));
packager.process("src/PanZoom.js", "dist/PanZoom.js");
packager.process("src/PanZoom.UI.Drag.js", "dist/PanZoom.UI.Drag.js");

