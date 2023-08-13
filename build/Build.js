"use strict";
/**
 * @file
 * Build.js
 *
 * Create ./dist/ versions of files. Uglify and add url/version/timestamp.
 */

const fs = require("fs");
const path = require("path");
let pjson;
let uglify;

const processFile = function(input_file, output_file) {
  const input = fs.readFileSync(input_file, "utf8");
  const output = _addHeader(uglify.minify(input).code, output_file);

  const result = fs.writeFileSync(output_file, output, "utf8");
  console.log("Wrote", output_file);
};

const _addHeader = function(code, filename) {
  return `
${_getHeader(filename)}

${code}
`.trim();
};

const _getHeader = function(output_file) {
  let header = `
/* {{url}} */
/* {{output_file}} v{{version}} {{date}} */
`.trim();

  const datetime = new Date().toString();

  return header
    .replace(/{{url}}/, pjson.homepage)
    .replace(/{{output_file}}/, output_file)
    .replace(/{{version}}/, pjson.version)
    .replace(/{{date}}/, datetime)
  ;
}

module.exports = function(di_pjson, di_uglify) {
  pjson = di_pjson;
  uglify = di_uglify;

  return {
    processFile: processFile
  };
};
